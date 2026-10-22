import moment from "moment"
import type { ApiTypes } from "@balance/api-types"
import { pc, TxClient } from "./prisma"
import { apiError } from "./errors"
import { cleanName } from "./utils/cleanName"

export const transactionQueryOpts = {
  include: {
    category: { select: { id: true, name: true, cleanedName: true } },
    account: { select: { id: true, name: true, cleanedName: true } },
    tags: { include: { tags: { select: { name: true } } } },
  },
}

/** Throws 404 unless the transaction exists and belongs to the user. */
export const confirmT = async (transactionId: string, userId: string) => {
  const found = await pc.transaction.findUnique({
    where: { id: transactionId },
  })
  if (!found || found.userId !== userId) {
    throw apiError(
      404,
      "Couldn't find transaction",
      "Transaction couldn't be found, or the user isn't authorized"
    )
  }
  return found
}

/** Throws 404 unless the category exists and belongs to the user. */
export const confirmC = async (id: string, userId: string) => {
  const found = await pc.category.findUnique({ where: { id } })
  if (!found || found.userId !== userId) {
    throw apiError(
      404,
      "Couldn't find category",
      "Category couldn't be found, or the user isn't authorized"
    )
  }
  return found
}

/** Returns the cleaned name, or throws 400 when the user already has it. */
export const checkValidCategoryName = async (name: string, userId: string) => {
  const cleanedName = cleanName(name)
  const found = await pc.category.findFirst({ where: { cleanedName, userId } })
  if (found) {
    throw apiError(
      400,
      "Couldn't create budget",
      "Category with that name already exists"
    )
  }
  return cleanedName
}

/**
 * Get Categories (id, name), get CategoryMonth (amount) for a month,
 * aggregate transactions (amount) into usedAmount for that month,
 * and format.
 */
export const getCategoriesWithTransAgg = async (
  userId: string,
  startMonth: string,
  prisma: TxClient | typeof pc = pc
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

export const getAccountsWithTransAgg = async (
  userId: string,
  accountId: string | undefined,
  startMonth: string,
  prisma: TxClient | typeof pc = pc
): Promise<ApiTypes.Account.TSerialized[]> => {
  const curMonth = moment(startMonth).format("YYYY-MM")
  const nextMonth = moment(curMonth).add(1, "month").format("YYYY-MM")

  const aggTrans = await prisma.transaction.groupBy({
    by: ["accountId"],
    where: { userId, AND: { date: { gte: curMonth, lt: nextMonth } } },
    _sum: { amount: true },
  })
  const aggTransNorm = new Map<string, number>()
  for (const a of aggTrans) {
    if (a.accountId && a._sum) {
      aggTransNorm.set(a.accountId, a._sum.amount || 0)
    }
  }

  const accounts = await prisma.account.findMany({
    where: { userId, id: accountId },
  })
  return accounts.map(a => ({
    id: a.id,
    name: a.name,
    accountType: a.accountType,
    month: curMonth,
    usedAmount: aggTransNorm.get(a.id) || 0,
  }))
}

/** User with accounts and this month's categories (login/verify response). */
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
      prisma
    )
    return { ...user, categories }
  })
}

const MONTH = /^\d{4}-\d{2}$/

/** ?startMonth=YYYY-MM, defaulting to the current month. */
export const monthParam = (value: string | undefined, title: string) => {
  const month = value || moment().format("YYYY-MM")
  if (!MONTH.test(month)) {
    throw apiError(400, title, "Month must be in YYYY-MM format")
  }
  return month
}

/** One category with its budget and spend for a month. */
export const getCategoryForMonth = async (
  id: string,
  userId: string,
  month: string,
  prisma: TxClient | typeof pc = pc
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
