import { NextResponse } from "next/server"
import type { ApiTypes } from "@balance/api-types"
import { pc } from "@/server/prisma"
import { apiError } from "@/server/errors"
import { noContent, readJson, withAuth } from "@/server/handler"
import { cleanName } from "@/server/utils/cleanName"

export const runtime = "nodejs"

type Params = { id: string }

const notFound = () =>
  apiError(404, "Couldn't find account", "Account couldn't be found")

/** Change name and/or type (old POST /account/change/:id). */
export const PATCH = withAuth<Params>(async (request, { params, user }) => {
  const { id } = params
  const { name, accountType } =
    await readJson<ApiTypes.Account.ChangeRequest>(request)

  const found = await pc.account.findFirst({ where: { id, userId: user.id } })
  if (!found) throw notFound()

  const changed = await pc.account.update({
    where: { id, userId: user.id },
    data: {
      ...(name ? { name, cleanedName: cleanName(name) } : {}),
      ...(accountType ? { accountType } : {}),
    },
    select: { id: true, name: true, accountType: true },
  })
  const res: ApiTypes.Account.ChangeResponse = changed
  return NextResponse.json(res)
})

/** Delete one account (old POST /account/remove). */
export const DELETE = withAuth<Params>(async (_request, { params, user }) => {
  const { count } = await pc.account.deleteMany({
    where: { id: params.id, userId: user.id },
  })
  if (!count) throw notFound()
  return noContent()
})
