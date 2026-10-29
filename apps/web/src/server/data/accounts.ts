import "server-only"
import moment from "moment"
import { uuidv7 } from "uuidv7"
import type { ApiTypes } from "@balance/api-types"
import { pc, TxClient } from "../prisma"
import { apiError } from "../errors"
import { cleanName } from "../utils/cleanName"

export const listAccountNames = async (userId: string) =>
  pc.account.findMany({
    where: { userId },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  })

export const getAccountsWithTransAgg = async (
  userId: string,
  accountId: string | undefined,
  startMonth: string,
  prisma: TxClient | typeof pc = pc,
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
    include: {
      plaidItem: {
        select: {
          id: true,
          institutionName: true,
          status: true,
          lastSyncedAt: true,
        },
      },
    },
  })
  return accounts.map(a => ({
    id: a.id,
    name: a.name,
    accountType: a.accountType,
    month: curMonth,
    usedAmount: aggTransNorm.get(a.id) || 0,
    bank: a.plaidItem
      ? {
          itemId: a.plaidItem.id,
          institutionName: a.plaidItem.institutionName,
          mask: a.mask,
          status: a.plaidItem.status as ApiTypes.Account.LinkedBank["status"],
          lastSyncedAt: a.plaidItem.lastSyncedAt?.toISOString() ?? null,
        }
      : null,
  }))
}

/** All of the user's accounts with their totals for a month. */
export const listAccounts = (userId: string, month: string) =>
  getAccountsWithTransAgg(userId, undefined, month)

export const assertAccountOwned = async (
  accountId: string,
  userId: string,
  prisma: TxClient | typeof pc = pc,
) => {
  const account = await prisma.account.findFirst({
    where: { id: accountId, userId },
  })
  if (!account) {
    throw apiError(400, "Transaction", "Account couldn't be found")
  }
}

export const createAccount = async (
  userId: string,
  {
    name,
    accountType,
    initialBalance,
  }: {
    name: string
    accountType: string
    initialBalance: number
  },
): Promise<{
  account: {
    id: string
    name: string
    cleanedName: string
    accountType: string
    userId: string
  }
} | null> => {
  const account = await pc.account.create({
    data: {
      id: uuidv7(),
      userId,
      name,
      cleanedName: cleanName(name),
      accountType,
      transactions: {
        create: [
          {
            id: uuidv7(),
            date: moment().format("YYYY-MM-DD"),
            amount: initialBalance,
            payee: "Initial balance",
            type: "incoming",
            userId,
          },
        ],
      },
    },
  })

  return { account }
}

export const changeAccount = async (
  userId: string,
  id: string,
  { name, accountType }: Partial<ApiTypes.Account.ChangeRequest>,
): Promise<ApiTypes.Account.ChangeResponse | null> => {
  const found = await pc.account.findFirst({ where: { id, userId } })
  if (!found) return null
  return pc.account.update({
    where: { id, userId },
    data: {
      ...(name ? { name, cleanedName: cleanName(name) } : {}),
      ...(accountType ? { accountType } : {}),
    },
    select: { id: true, name: true, accountType: true },
  })
}

export const deleteAccount = async (
  userId: string,
  accountId: string,
): Promise<number> => {
  const { count } = await pc.account.deleteMany({
    where: { id: accountId, userId },
  })
  return count
}
