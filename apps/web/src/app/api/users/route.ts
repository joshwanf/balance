import { NextResponse } from "next/server"
import { uuidv7 } from "uuidv7"
import type { ApiTypes } from "@balance/api-types"
import { pc } from "@/server/prisma"
import { apiError } from "@/server/errors"
import { readJson, withErrors } from "@/server/handler"
import { setTokenCookie } from "@/server/auth"
import { hashPassword } from "@/server/password"

export const runtime = "nodejs"

/** Sign up (old POST /session/create). */
export const POST = withErrors(async request => {
  const body = await readJson<ApiTypes.Session.CreateRequest>(request)
  const { firstName, lastName, username, email, password } = body

  const isValidBody =
    !!firstName &&
    !!lastName &&
    !!email &&
    !!username &&
    username.length >= 4 &&
    !!password &&
    password.length >= 6
  if (!isValidBody) {
    throw apiError(
      400,
      "Create user",
      "Include a first name, last name, username, email, and password"
    )
  }

  const existingUser = await pc.user.findFirst({
    where: { OR: [{ username }, { email }] },
  })
  if (existingUser) {
    throw apiError(400, "Create user", "Username/email already exist")
  }

  const { hashedPassword, ...safeUser } = await pc.user.create({
    data: {
      id: uuidv7(),
      firstName,
      lastName,
      email,
      username,
      hashedPassword: await hashPassword(password),
    },
  })
  await setTokenCookie(safeUser)
  const res: ApiTypes.Session.CreateResponse = safeUser
  return NextResponse.json(res, { status: 201 })
})
