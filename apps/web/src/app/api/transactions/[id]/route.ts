import { NextResponse } from "next/server"
import type { ApiTypes } from "@balance/api-types"
import { pc } from "@/server/prisma"
import { noContent, readJson, withAuth } from "@/server/handler"
import { confirmT, transactionQueryOpts } from "@/server/queries"
import {
  changeSchema,
  formatTransaction,
  parseBody,
} from "@/server/transactions"
import { changeTransaction, deleteTransaction } from "@/server/data"

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

/** Update any supplied fields. categoryId "" clears the category. */
export const PATCH = withAuth<Params>(async (request, { params, user }) => {
  const { id } = params
  const { categoryId, ...fields } = parseBody(
    changeSchema,
    await readJson(request),
    "Change transaction",
  )
  const updated = await changeTransaction(user.id, id, {
    categoryId,
    ...fields,
  })
  const res: ApiTypes.Transaction.ChangeResponse = updated
  return NextResponse.json(res)
})

export const DELETE = withAuth<Params>(async (_request, { params, user }) => {
  await deleteTransaction(user.id, params.id)
  return noContent()
})
