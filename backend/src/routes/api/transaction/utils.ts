import { Prisma, PrismaClient } from "@prisma/client"
import { getNextMonth } from "../../../utils/helpers/date"
import { pc } from "../../../utils/prismaClient"
import {
  DefaultArgs,
  PrismaClientKnownRequestError,
} from "@prisma/client/runtime/library"
import moment from "moment"

export const queryOpts = {
  include: {
    category: {
      select: {
        id: true,
        name: true,
        cleanedName: true,
        amount: true,
        userId: false,
      },
    },
    account: { select: { id: true, name: true, cleanedName: true } },
  },
}

export const confirmT = async (transactionId: string, userId: string) => {
  console.log("confirming transaction")
  try {
    const foundT = await pc.transaction.findUnique({
      where: { id: transactionId },
    })
    console.log("found transaction")
    const isValidT = foundT && userId === foundT.userId
    if (!isValidT) {
      throw {
        title: "Couldn't find transaction",
        message: "Transaction couldn't be found, or the user isn't authorized",
        status: 404,
      }
    }
    return true
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      throw { title: "prisma error", message: e, status: 404 }
    }
    throw e
  }
}

/**
 * Get Categories (id, name), get CategoryMonth.amount for a month,
 * aggregate transactions.amount into usedAmount for a month,
 * and format.
 *
 * Intended to be used in `prism.$transaction(async prisma => {})`
 * @param userId {string} the user id
 * @param curMonth {string} YYYY-MM
 * @param prisma the prisma client
 */
export const getCategoriesWithTransAgg = async (
  userId: string,
  startMonth: string,
  prisma: Omit<
    PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >
) => {
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

  // users categories and CategoryMonth for that month
  const cats = await prisma.category.findMany({
    where: { userId },
    include: {
      CategoryMonth: {
        where: { AND: { month: { lt: nextMonth, gte: curMonth } } },
      },
    },
  })
  // unpack cats and only keep id, name, CategoryMonth[0].month, CategoryMonth[0].amount
  const unpackedCats = cats.map(cat => {
    // CategoryMonth could be an empty array
    const { CategoryMonth } = cat
    const month = CategoryMonth.length ? cat.CategoryMonth[0].month : curMonth
    const amount = CategoryMonth.length ? cat.CategoryMonth[0].amount : 0
    const usedAmount = aggTransNorm.get(cat.id) || 0
    return {
      id: cat.id,
      name: cat.name,
      month,
      amount,
      usedAmount,
    }
  })
  return unpackedCats
}
