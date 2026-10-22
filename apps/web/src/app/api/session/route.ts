import { NextResponse } from "next/server"
import type { ApiTypes } from "@balance/api-types"
import { pc } from "@/server/prisma"
import { apiError } from "@/server/errors"
import { readJson, withErrors } from "@/server/handler"
import {
  clearTokenCookie,
  getSessionUser,
  setTokenCookie,
} from "@/server/auth"
import { getUserWithRelations } from "@/server/queries"
import { hashPassword, isHashed, verifyPassword } from "@/server/password"

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
  await clearTokenCookie()
  const body = await readJson<ApiTypes.Session.LoginRequest>(request)
  const credential = body.credential || ""
  const password = body.password || ""

  const found = await pc.user.findFirst({
    where: { OR: [{ username: credential }, { email: credential }] },
  })
  const isValid =
    found && (await verifyPassword(password, found.hashedPassword))
  if (!found || !isValid) {
    throw apiError(401, "Login", "Couldn't find user, check login info")
  }

  // Upgrade legacy plaintext passwords on a successful login.
  if (!isHashed(found.hashedPassword)) {
    await pc.user.update({
      where: { id: found.id },
      data: { hashedPassword: await hashPassword(password) },
    })
  }

  const user = await getUserWithRelations(found.id)
  if (!user) {
    throw apiError(401, "Login", "Couldn't find user, check login info")
  }
  const { accounts, categories, ...safeUser } = user
  await setTokenCookie(safeUser)
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
