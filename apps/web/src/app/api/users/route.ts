import { NextResponse } from "next/server"
import type { ApiTypes } from "@balance/api-types"
import { apiError } from "@/server/errors"
import { readJson, withErrors } from "@/server/handler"
import { createUser } from "@/server/auth"

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
      "Include a first name, last name, username, email, and password",
    )
  }

  const user = await createUser({
    firstName,
    lastName,
    username,
    email,
    password,
  })

  if (!user) {
    throw apiError(400, "Create user", "Username/email already exists.")
  }

  const res: ApiTypes.Session.CreateResponse = user
  return NextResponse.json(res, { status: 201 })
})
