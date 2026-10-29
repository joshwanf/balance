import { NextRequest, NextResponse } from "next/server"
import { uuidv7 } from "uuidv7"
import type { ApiTypes } from "@balance/api-types"
import { pc } from "@/server/prisma"
import { listParam, readJson, searchParam, withAuth } from "@/server/handler"
import { monthParam } from "@/server/queries"
import {
  listTransactions,
  searchTransactions,
} from "@/server/data/transactions"
import {
  assertAccountOwned,
  assertCategoryOwned,
  createSchema,
  getFormattedTransaction,
  parseBody,
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
    "List transactions",
  )
  const res = await listTransactions(
    user.id,
    startMonth,
    searchParam(request, "endMonth"),
  )
  return NextResponse.json(res)
}

const search = async (request: NextRequest, user: SessionUser) => {
  const res = await searchTransactions(user.id, {
    terms: listParam(request, "q"),
    tags: listParam(request, "tags"),
    startDate: searchParam(request, "startDate"),
    endDate: searchParam(request, "endDate"),
  })
  return NextResponse.json(res)
}

/** Create a transaction, creating its category by name if needed. */
export const POST = withAuth(async (request, { user }) => {
  const title = "Create transaction"
  const { categoryId, ...fields } = parseBody(
    createSchema,
    await readJson(request),
    title,
  )
  await assertAccountOwned(fields.accountId, user.id)
  if (categoryId) {
    await assertCategoryOwned(categoryId, user.id)
  }

  const created = await pc.$transaction(async prisma => {
    const { id } = await prisma.transaction.create({
      data: {
        ...fields,
        id: uuidv7(),
        userId: user.id,
        categoryId: categoryId || null,
      },
    })
    return getFormattedTransaction(id, prisma)
  })
  const res: ApiTypes.Transaction.CreateResponse = created
  return NextResponse.json(res, { status: 201 })
})
