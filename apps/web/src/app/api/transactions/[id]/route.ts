import { NextResponse } from "next/server"
import type { ApiTypes } from "@balance/api-types"
import { pc } from "@/server/prisma"
import { noContent, readJson, withAuth } from "@/server/handler"
import { confirmT, transactionQueryOpts } from "@/server/queries"
import {
  assertAccountOwned,
  changeSchema,
  formatTransaction,
  getFormattedTransaction,
  parseBody,
  upsertCategoryId,
} from "@/server/transactions"

export const runtime = "nodejs"

type Params = { id: string }

/** One transaction with its category, account and tags. */
export const GET = withAuth<Params>(async (_request, { params, user }) => {
  const { id } = params
  await confirmT(id, user.id)

  const t = await pc.transaction.findUniqueOrThrow({
    where: { id, userId: user.id },
    ...transactionQueryOpts,
  })
  let category = null
  if (t.category) {
    const month = t.date.slice(0, 7)
    const [categoryMonth, agg] = await Promise.all([
      pc.categoryMonth.findFirst({
        where: { userId: user.id, categoryId: t.category.id, month },
      }),
      pc.transaction.aggregate({
        where: { userId: user.id, categoryId: t.category.id },
        _sum: { amount: true },
      }),
    ])
    category = {
      ...t.category,
      amount: categoryMonth?.amount ?? 0,
      usedAmount: agg._sum.amount ?? 0,
    }
  }
  const res: ApiTypes.Transaction.RetrieveTransactionResponse = {
    ...formatTransaction(t),
    category,
  } as ApiTypes.Transaction.RetrieveTransactionResponse
  return NextResponse.json(res)
})

/**
 * Update any supplied fields. categoryName "" clears the category; any
 * other value moves it to that category, creating it if needed.
 */
export const PATCH = withAuth<Params>(async (request, { params, user }) => {
  const { id } = params
  const { categoryName, ...fields } = parseBody(
    changeSchema,
    await readJson(request),
    "Change transaction"
  )
  await confirmT(id, user.id)
  if (fields.accountId) await assertAccountOwned(fields.accountId, user.id)

  const updated = await pc.$transaction(async prisma => {
    let categoryId: string | null | undefined = undefined
    if (categoryName === "") categoryId = null
    else if (categoryName) {
      categoryId = await upsertCategoryId(categoryName, user.id, prisma)
    }
    await prisma.transaction.update({
      where: { id, userId: user.id },
      data: { ...fields, categoryId },
    })
    return getFormattedTransaction(id, prisma)
  })
  const res: ApiTypes.Transaction.ChangeResponse = updated
  return NextResponse.json(res)
})

export const DELETE = withAuth<Params>(async (_request, { params, user }) => {
  await confirmT(params.id, user.id)
  await pc.transaction.delete({ where: { id: params.id, userId: user.id } })
  return noContent()
})
