import { pc } from "../../../utils/prismaClient"
import {
  DefaultArgs,
  PrismaClientKnownRequestError,
} from "@prisma/client/runtime/library"
import { cleanName } from "../../../utils/helpers/cleanName"
import { ApiTypes } from "../../../types/api"
import { Prisma, PrismaClient } from "@prisma/client"
import moment from "moment"

type AccountSerialized = ApiTypes.Account.TSerialized
type GetAccountsWitHTransAgg = (
  userId: string,
  accountId: string | undefined,
  startMonth: string,
  prisma: Omit<
    PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >
) => Promise<AccountSerialized[]>

export const getAccountsWithTransAgg: GetAccountsWitHTransAgg = async (
  userId,
  accountId,
  startMonth,
  prisma
) => {
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

  // users accounts
  const accounts = await prisma.account.findMany({
    where: { userId, id: accountId },
  })

  // unpack accounts and only keep id, name, type
  const unpackedAccounts = accounts.map(a => {
    const month = curMonth
    const usedAmount = aggTransNorm.get(a.id) || 0
    return {
      id: a.id,
      name: a.name,
      accountType: a.accountType,
      month,
      usedAmount,
    }
  })
  return unpackedAccounts
}
