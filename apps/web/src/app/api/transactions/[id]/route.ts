import { NextResponse } from "next/server"
import type { ApiTypes } from "@balance/api-types"
import { noContent, readJson, withAuth } from "@/server/handler"
import { changeSchema, parseBody } from "@/server/schemas/transactions"
import {
  changeTransaction,
  deleteTransaction,
  getTransactionDetail,
} from "@/server/data"

export const runtime = "nodejs"

type Params = { id: string }

/** One transaction with its category, account and tags. */
export const GET = withAuth<Params>(async (_request, { params, user }) => {
  const res = await getTransactionDetail(user.id, params.id)
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
