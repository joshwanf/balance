import { NextRequest, NextResponse } from "next/server"
import moment from "moment"
import { uuidv7 } from "uuidv7"
import type { ApiTypes } from "@balance/api-types"
import { pc } from "@/server/prisma"
import {
  listParam,
  readJson,
  searchParam,
  withAuth,
} from "@/server/handler"
import { getCategoriesWithTransAgg, monthParam } from "@/server/queries"
import {
  assertAccountOwned,
  createSchema,
  formatTransaction,
  getFormattedTransaction,
  parseBody,
  tagsInclude,
  upsertCategoryId,
} from "@/server/transactions"
import { SessionUser } from "@/server/auth"

export const runtime = "nodejs"

const SEARCH_KEYS = ["q", "startDate", "endDate", "tags"]

/**
 * GET /api/transactions?startMonth=&endMonth= lists a month (old /list).
 * Any of ?q=&startDate=&endDate=&tags= makes it a search (old /search).
 */
export const GET = withAuth(async (request, { user }) => {
  const isSearch = SEARCH_KEYS.some(k => request.nextUrl.searchParams.has(k))
  return isSearch ? search(request, user) : list(request, user)
})

const list = async (request: NextRequest, user: SessionUser) => {
  const startMonth = monthParam(
    searchParam(request, "startMonth"),
    "List transactions"
  )
  const endMonth =
    searchParam(request, "endMonth") ||
    moment(startMonth, "YYYY-MM").add(1, "month").format("YYYY-MM")

  const result = await pc.$transaction(async prisma => {
    const trans = await prisma.transaction.findMany({
      include: tagsInclude,
      where: { userId: user.id, date: { lt: endMonth, gte: startMonth } },
      orderBy: [{ date: "desc" }, { id: "desc" }],
    })
    const allTags = await prisma.tags.findMany({ where: { userId: user.id } })
    const categories = await getCategoriesWithTransAgg(
      user.id,
      startMonth,
      prisma
    )
    return {
      transactions: trans.map(formatTransaction),
      categories,
      tags: allTags.map(t => t.name),
    }
  })
  const res: ApiTypes.Transaction.ListResponse = result
  return NextResponse.json(res)
}

const search = async (request: NextRequest, user: SessionUser) => {
  const terms = listParam(request, "q").map(t => t.toLowerCase())
  const tags = listParam(request, "tags")
  const startDate = searchParam(request, "startDate")
  const endDate = searchParam(request, "endDate")

  const trans = await pc.transaction.findMany({
    include: tagsInclude,
    where: {
      userId: user.id,
      date: { gte: startDate, lte: endDate },
      ...(tags.length ? { tags: { some: { tags: { name: { in: tags } } } } } : {}),
    },
    orderBy: [{ date: "desc" }, { id: "desc" }],
  })
  const matches = terms.length
    ? trans.filter(t => terms.some(term => t.payee.toLowerCase().includes(term)))
    : trans

  const res: ApiTypes.Transaction.SearchResponse = {
    transactions: matches.map(formatTransaction),
  }
  return NextResponse.json(res)
}

/** Create a transaction, creating its category by name if needed. */
export const POST = withAuth(async (request, { user }) => {
  const title = "Create transaction"
  const { categoryName, ...fields } = parseBody(
    createSchema,
    await readJson(request),
    title
  )
  await assertAccountOwned(fields.accountId, user.id)

  const created = await pc.$transaction(async prisma => {
    const categoryId = categoryName
      ? await upsertCategoryId(categoryName, user.id, prisma)
      : null
    const { id } = await prisma.transaction.create({
      data: { ...fields, id: uuidv7(), userId: user.id, categoryId },
    })
    return getFormattedTransaction(id, prisma)
  })
  const res: ApiTypes.Transaction.CreateResponse = created
  return NextResponse.json(res, { status: 201 })
})
