import "server-only"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import type { ApiTypes } from "@balance/api-types"
import config from "./config"
import { pc } from "./prisma"

const { secret, expiresIn } = config.jwtConfig
const TOKEN = "token"

export type SessionUser = ApiTypes.Session.SafeUser

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

/** Reads and verifies the token cookie, then loads the user (old restoreUser). */
export const getSessionUser = async (): Promise<SessionUser | null> => {
  const store = await cookies()
  const token = store.get(TOKEN)?.value
  if (!token) return null

  try {
    const decoded = jwt.verify(token, secret)
    if (typeof decoded !== "object" || !decoded.data?.id) return null
    return await pc.user.findUnique({
      where: { id: decoded.data.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        username: true,
      },
    })
  } catch {
    return null
  }
}
