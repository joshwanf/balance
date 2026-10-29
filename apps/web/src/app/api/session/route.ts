import { NextResponse } from "next/server"
import type { ApiTypes } from "@balance/api-types"
import { apiError } from "@/server/errors"
import { readJson, withErrors } from "@/server/handler"
import { clearTokenCookie, getSessionUser, login } from "@/server/auth"
import { getUserWithRelations } from "@/server/data"

export const runtime = "nodejs"

/** Restore the session from the token cookie (old POST /session/verify). */
export const GET = withErrors(async () => {
  const sessionUser = await getSessionUser()
  const user = sessionUser ? await getUserWithRelations(sessionUser.id) : null
  if (!user) await clearTokenCookie()
  return NextResponse.json({ status: "success", success: { user } })
})

/** Log in (old POST /session/login). */
export const POST = withErrors(async request => {
  const body = await readJson<ApiTypes.Session.LoginRequest>(request)
  const credential = body.credential || ""
  const password = body.password || ""

  const found = await login({ credential, password })

  if (!found) {
    throw apiError(401, "Login", "Couldn't find user, check login info")
  }

  const user = await getUserWithRelations(found.id)
  if (!user) {
    throw apiError(401, "Login", "Couldn't find user, check login info")
  }

  const res: ApiTypes.Session.LoginResponse = {
    status: "success",
    success: { user },
  }
  return NextResponse.json(res)
})

/** Log out (old POST /session/logout). */
export const DELETE = withErrors(async () => {
  await clearTokenCookie()
  return NextResponse.json({ status: "success", success: { user: null } })
})
