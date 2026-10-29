import { NextResponse } from "next/server"
import type { ApiTypes } from "@balance/api-types"
import { apiError } from "@/server/errors"
import { noContent, readJson, withAuth } from "@/server/handler"
import { changeAccount, deleteAccount } from "@/server/data"

export const runtime = "nodejs"

type Params = { id: string }

const notFound = () =>
  apiError(404, "Couldn't find account", "Account couldn't be found")

/** Change name and/or type (old POST /account/change/:id). */
export const PATCH = withAuth<Params>(async (request, { params, user }) => {
  const { id } = params
  const { name, accountType } =
    await readJson<ApiTypes.Account.ChangeRequest>(request)

  const changed = await changeAccount(user.id, id, { name, accountType })
  if (!changed) throw notFound()
  const res: ApiTypes.Account.ChangeResponse = changed
  return NextResponse.json(res)
})

/** Delete one account (old POST /account/remove). */
export const DELETE = withAuth<Params>(async (_request, { params, user }) => {
  const count = await deleteAccount(user.id, params.id)
  if (!count) throw notFound()
  return noContent()
})
