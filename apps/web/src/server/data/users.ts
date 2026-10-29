import "server-only"
import moment from "moment"
import { Prisma } from "@prisma/client"
import { uuidv7 } from "uuidv7"
import type { ApiTypes } from "@balance/api-types"
import { pc } from "../prisma"
import { hashPassword, isHashed, verifyPassword } from "../password"
import { getCategoriesWithTransAgg } from "./categories"

export const getUserWithRelations = async (userId: string) => {
  const startMonth = moment().format("YYYY-MM")
  return pc.$transaction(async prisma => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        username: true,
        accounts: { select: { id: true, name: true } },
      },
    })
    if (!user) return null
    const categories = await getCategoriesWithTransAgg(
      user.id,
      startMonth,
      prisma,
    )
    return { ...user, categories }
  })
}

const safeUserSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  username: true,
} as const

type SafeUser = ApiTypes.Session.SafeUser

export const getUserById = async (id: string): Promise<SafeUser | null> =>
  pc.user.findUnique({ where: { id }, select: safeUserSelect })

export const findUserByCredentials = async (
  credential: string,
  password: string,
): Promise<SafeUser | null> => {
  const found = await pc.user.findFirst({
    where: { OR: [{ username: credential }, { email: credential }] },
  })
  if (!found || !(await verifyPassword(password, found.hashedPassword))) {
    return null
  }

  if (!isHashed(found.hashedPassword)) {
    await pc.user.update({
      where: { id: found.id },
      data: { hashedPassword: await hashPassword(password) },
    })
  }

  const { hashedPassword, ...safeUser } = found
  return safeUser
}

export const createUserRecord = async ({
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
}): Promise<SafeUser | null> => {
  const existingUser = await pc.user.findFirst({
    where: { OR: [{ username }, { email }] },
  })
  if (existingUser) return null

  try {
    return await pc.user.create({
      data: {
        id: uuidv7(),
        firstName,
        lastName,
        email,
        username,
        hashedPassword: await hashPassword(password),
      },
      select: safeUserSelect,
    })
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2002"
    ) {
      return null
    }
    throw e
  }
}
