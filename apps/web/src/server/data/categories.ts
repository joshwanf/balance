import "server-only"
import moment from "moment"
import { Prisma } from "@prisma/client"
import { uuidv7 } from "uuidv7"
import type { ApiTypes } from "@balance/api-types"
import { pc, TxClient } from "../prisma"
import { apiError } from "../errors"
import { cleanName } from "../utils/cleanName"

export const listCategoryNames = async (userId: string) => {
  const categories = await pc.category.findMany({
    where: { userId },
    select: { id: true, name: true },
  })
  return categories
}

/**
 * Get Categories (id, name), get CategoryMonth (amount) for a month,
 * aggregate transactions (amount) into usedAmount for that month,
 * and format.
 */
export const getCategoriesWithTransAgg = async (
  userId: string,
  startMonth: string,
  prisma: TxClient | typeof pc = pc,
): Promise<ApiTypes.Category.TSerialized[]> => {
  const curMonth = moment(startMonth).format("YYYY-MM")
  const nextMonth = moment(curMonth).add(1, "month").format("YYYY-MM")

  const aggTrans = await prisma.transaction.groupBy({
    by: ["categoryId"],
    where: {
      userId,
      NOT: { categoryId: null },
      AND: { date: { lt: nextMonth, gte: curMonth } },
    },
    _sum: { amount: true },
  })
  const aggTransNorm = new Map<string, number>()
  for (const a of aggTrans) {
    if (a.categoryId && a._sum) {
      aggTransNorm.set(a.categoryId, a._sum.amount || 0)
    }
  }

  const cats = await prisma.category.findMany({
    where: { userId },
    include: {
      CategoryMonth: {
        where: { AND: { month: { lt: nextMonth, gte: curMonth } } },
      },
    },
    orderBy: { id: "desc" },
  })
  return cats.map(cat => {
    const { CategoryMonth } = cat
    const month = CategoryMonth.length ? CategoryMonth[0].month : curMonth
    const amount = CategoryMonth.length ? CategoryMonth[0].amount : 0
    const usedAmount = aggTransNorm.get(cat.id) || 0
    return { id: cat.id, name: cat.name, amount, month, usedAmount }
  })
}

/** This month's categories with budget and spend (alias used by pages). */
export const listCategories = (userId: string, month: string) =>
  getCategoriesWithTransAgg(userId, month)

/** One category with its budget and spend for a month. */
export const getCategoryForMonth = async (
  id: string,
  userId: string,
  month: string,
  prisma: TxClient | typeof pc = pc,
): Promise<ApiTypes.Category.TSerialized | null> => {
  const nextMonth = moment(month, "YYYY-MM").add(1, "month").format("YYYY-MM")
  const category = await prisma.category.findFirst({
    where: { id, userId },
    select: { id: true, name: true },
  })
  if (!category) return null

  const categoryMonth = await prisma.categoryMonth.findFirst({
    where: { categoryId: id, userId, month },
    select: { amount: true, month: true },
  })
  const agg = await prisma.transaction.aggregate({
    where: { userId, categoryId: id, date: { lt: nextMonth, gte: month } },
    _sum: { amount: true },
  })
  return {
    ...category,
    month,
    amount: categoryMonth?.amount ?? 0,
    usedAmount: agg._sum.amount ?? 0,
  }
}

/** Throws 404 unless the category exists and belongs to the user. */
export const confirmC = async (id: string, userId: string) => {
  const found = await pc.category.findUnique({ where: { id } })
  if (!found || found.userId !== userId) {
    throw apiError(
      404,
      "Couldn't find category",
      "Category couldn't be found, or the user isn't authorized",
    )
  }
  return found
}

export const assertCategoryOwned = async (
  categoryId: string,
  userId: string,
  prisma: TxClient | typeof pc = pc,
) => {
  const category = await prisma.category.findFirst({
    where: { id: categoryId, userId },
  })
  if (!category) {
    throw apiError(400, "Transaction", "Category couldn't be found")
  }
}

/** Returns the cleaned name, or throws 400 when the user already has it. */
export const checkValidCategoryName = async (name: string, userId: string) => {
  const cleanedName = cleanName(name)
  const found = await pc.category.findFirst({ where: { cleanedName, userId } })
  if (found) {
    throw apiError(
      400,
      "Couldn't create budget",
      "Category with that name already exists",
    )
  }
  return cleanedName
}

export const createCategory = async (
  userId: string,
  { name, amount, month }: { name: string; amount: number; month: string },
) => {
  const cleanedName = await checkValidCategoryName(name, userId)

  const created = await pc.category
    .create({
      include: { CategoryMonth: true },
      data: {
        id: uuidv7(),
        userId,
        name,
        cleanedName,
        CategoryMonth: {
          create: [{ id: uuidv7(), amount, month, userId }],
        },
      },
    })
    .catch(e => {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2002"
      ) {
        throw apiError(
          400,
          "Couldn't create budget",
          "Category with that name already exists",
        )
      }
      throw e
    })

  return {
    id: created.id,
    name: created.name,
    month,
    amount: created.CategoryMonth[0].amount,
    usedAmount: 0,
  }
}

type ChangeCategoryRequest = Partial<ApiTypes.Category.ChangeRequest>

type ChangeCategoryResult = ApiTypes.Category.ChangeResponse

export const changeCategory = async (
  { userId, id, month }: { userId: string; id: string; month: string },
  { name, amount }: ChangeCategoryRequest,
): Promise<ChangeCategoryResult | null> => {
  await confirmC(id, userId)

  const result = await pc.$transaction(async prisma => {
    if (name) {
      await prisma.category.update({
        where: { id, userId },
        data: { name, cleanedName: cleanName(name) },
      })
    }
    await prisma.categoryMonth.upsert({
      where: {
        userId_categoryId_month: { userId, categoryId: id, month },
      },
      update: amount !== undefined ? { amount } : {},
      create: {
        id: uuidv7(),
        userId,
        categoryId: id,
        amount: amount ?? 0,
        month,
      },
    })
    return getCategoryForMonth(id, userId, month, prisma)
  })

  return result
}

export const deleteCategories = async (
  userId: string,
  categoryIds: string[],
) => {
  const { count } = await pc.category.deleteMany({
    where: { id: { in: categoryIds }, userId },
  })

  return count
}
