import "server-only"
import { cache } from "react"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import type { ApiTypes } from "@balance/api-types"
import config from "./config"
import {
  createUserRecord,
  findUserByCredentials,
  getUserById,
} from "./data/users"
import { redirect } from "next/navigation"

const { secret, expiresIn } = config.jwtConfig
const TOKEN = "token"

export type SessionUser = ApiTypes.Session.SafeUser

export const login = async ({
  credential,
  password,
}: {
  credential: string
  password: string
}): Promise<SessionUser | null> => {
  await clearTokenCookie()
  const user = await findUserByCredentials(credential, password)
  if (user) await setTokenCookie(user)
  return user
}

export const logout = async () => {
  await clearTokenCookie()
}

export const createUser = async (
  details: Parameters<typeof createUserRecord>[0],
): Promise<SessionUser | null> => {
  const user = await createUserRecord(details)
  if (user) await setTokenCookie(user)
  return user
}

export const setTokenCookie = async (user: SessionUser) => {
  const safeUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    username: user.username,
  }
  const token = jwt.sign({ data: safeUser }, secret, { expiresIn })

  const store = await cookies()
  store.set(TOKEN, token, {
    maxAge: expiresIn,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  })
  return token
}

export const clearTokenCookie = async () => {
  const store = await cookies()
  store.delete(TOKEN)
}

/**
 * Reads and verifies the token cookie, then loads the user (old restoreUser).
 * Cached per request, so a layout and its page share one lookup.
 */
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const store = await cookies()
  const token = store.get(TOKEN)?.value
  if (!token) return null

  try {
    const decoded = jwt.verify(token, secret)
    if (typeof decoded !== "object" || !decoded.data?.id) return null
    return await getUserById(decoded.data.id)
  } catch {
    return null
  }
})

export const requireUser = async () => {
  const user = await getSessionUser()
  if (!user) redirect("/")
  return user
}
