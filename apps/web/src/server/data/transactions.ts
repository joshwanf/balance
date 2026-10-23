import "server-only"
import moment from "moment"
import type { ApiTypes } from "@balance/api-types"
import { pc } from "../prisma"
import { getCategoriesWithTransAgg } from "../queries"
import { formatTransaction, tagsInclude } from "../transactions"

/** A month of transactions with that month's categories and all tag names. */
export const listTransactions = async (
  userId: string,
  startMonth: string,
  endMonth = moment(startMonth, "YYYY-MM").add(1, "month").format("YYYY-MM"),
): Promise<ApiTypes.Transaction.ListResponse> =>
  pc.$transaction(async prisma => {
    const trans = await prisma.transaction.findMany({
      include: tagsInclude,
      where: { userId, date: { lt: endMonth, gte: startMonth } },
      orderBy: [{ date: "desc" }, { id: "desc" }],
    })
    const allTags = await prisma.tags.findMany({ where: { userId } })
    const categories = await getCategoriesWithTransAgg(
      userId,
      startMonth,
      prisma,
    )
    return {
      transactions: trans.map(formatTransaction),
      categories,
      tags: allTags.map(t => t.name),
    }
  })

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
    include: tagsInclude,
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
  return { transactions: matches.map(formatTransaction) }
}
