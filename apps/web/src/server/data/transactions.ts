import "server-only"
import moment from "moment"
import type { ApiTypes } from "@balance/api-types"
import { pc, TxClient } from "../prisma"
import { getCategoriesWithTransAgg } from "../queries"
import { formatRow, rowInclude } from "../transactions"

const nextMonth = (month: string) =>
  moment(month, "YYYY-MM").add(1, "month").format("YYYY-MM")

/** A month of transaction rows, newest first. */
export const listTransactionRows = async (
  userId: string,
  startMonth: string,
  endMonth = nextMonth(startMonth),
  prisma: TxClient | typeof pc = pc,
): Promise<ApiTypes.Transaction.TRow[]> => {
  const trans = await prisma.transaction.findMany({
    include: rowInclude,
    where: { userId, date: { lt: endMonth, gte: startMonth } },
    orderBy: [{ date: "desc" }, { id: "desc" }],
  })
  return trans.map(formatRow)
}

/** The user's tag names, for the tag picker. */
export const listTagNames = async (
  userId: string,
  prisma: TxClient | typeof pc = pc,
) => {
  const tags = await prisma.tags.findMany({
    where: { userId },
    select: { name: true },
  })
  return tags.map(t => t.name)
}

/** A month of transactions with that month's categories and all tag names. */
export const listTransactions = async (
  userId: string,
  startMonth: string,
  endMonth = nextMonth(startMonth),
): Promise<ApiTypes.Transaction.ListResponse> =>
  pc.$transaction(async prisma => ({
    transactions: await listTransactionRows(
      userId,
      startMonth,
      endMonth,
      prisma,
    ),
    categories: await getCategoriesWithTransAgg(userId, startMonth, prisma),
    tags: await listTagNames(userId, prisma),
  }))

export interface TransactionSearch {
  /** payee terms, matched case-insensitively, any of */
  terms?: string[]
  tags?: string[]
  startDate?: string
  endDate?: string
}

/** Transactions across all months matching the search. */
export const searchTransactions = async (
  userId: string,
  { terms = [], tags = [], startDate, endDate }: TransactionSearch,
): Promise<ApiTypes.Transaction.SearchResponse> => {
  const lowerTerms = terms.map(t => t.toLowerCase())
  const trans = await pc.transaction.findMany({
    include: rowInclude,
    where: {
      userId,
      date: { gte: startDate, lte: endDate },
      ...(tags.length
        ? { tags: { some: { tags: { name: { in: tags } } } } }
        : {}),
    },
    orderBy: [{ date: "desc" }, { id: "desc" }],
  })
  const matches = lowerTerms.length
    ? trans.filter(t =>
        lowerTerms.some(term => t.payee.toLowerCase().includes(term)),
      )
    : trans
  return { transactions: matches.map(formatRow) }
}
