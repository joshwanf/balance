import "server-only"
import { cache } from "react"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import type { ApiTypes } from "@balance/api-types"
import config from "./config"
import { pc } from "./prisma"
import { hashPassword, isHashed, verifyPassword } from "@/server/password"
import { uuidv7 } from "uuidv7"
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

  const found = await pc.user.findFirst({
    where: { OR: [{ username: credential }, { email: credential }] },
  })
  const isValid =
    found && (await verifyPassword(password, found.hashedPassword))
  if (!found || !isValid) {
    return null
  }

  // Upgrade legacy plaintext passwords on a successful login.
  if (!isHashed(found.hashedPassword)) {
    await pc.user.update({
      where: { id: found.id },
      data: { hashedPassword: await hashPassword(password) },
    })
  }

  const safeUser = {
    id: found.id,
    firstName: found.firstName,
    lastName: found.lastName,
    email: found.email,
    username: found.username,
  }
  await setTokenCookie(safeUser)

  return safeUser
}

export const logout = async () => {
  await clearTokenCookie()
}

export const createUser = async ({
  firstName,
  lastName,
  username,
  email,
  password,
}: {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
}): Promise<SessionUser | null> => {
  const existingUser = await pc.user.findFirst({
    where: { OR: [{ username }, { email }] },
  })
  if (existingUser) {
    return null
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

  return safeUser
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
})

export const requireUser = async () => {
  const user = await getSessionUser()
  if (!user) redirect("/")
  return user
}
