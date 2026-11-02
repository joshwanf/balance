import "server-only"
import moment from "moment"
import { uuidv7 } from "uuidv7"
import { z } from "zod"
import type { ApiTypes } from "@balance/api-types"
import { pc, TxClient } from "../prisma"
import { apiError } from "../errors"
import { cleanName } from "../utils/cleanName"
import { getNextMonth } from "../utils/date"
import { changeSchema, createSchema } from "../schemas/transactions"
import { assertAccountOwned } from "./accounts"
import { assertCategoryOwned, getCategoriesWithTransAgg } from "./categories"

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
      "Transaction couldn't be found, or the user isn't authorized",
    )
  }
  return found
}

export const tagsInclude = {
  tags: { include: { tags: { select: { name: true } } } },
} as const

type WithTags<T> = T & { tags: { tags: { name: string } }[] }

export const formatTransaction = <T extends object>({
  tags,
  ...rest
}: WithTags<T>) => ({ ...rest, tags: tags.map(t => t.tags.name) })

/** tags plus the account and category names a list row shows */
export const rowInclude = {
  ...tagsInclude,
  account: { select: { name: true } },
  category: { select: { name: true } },
} as const

type WithNames<T> = WithTags<T> & {
  account: { name: string }
  category: { name: string } | null
}

/** A list row: tag names, plus account and category names in place of the relations */
export const formatRow = <T extends object>({
  account,
  category,
  ...rest
}: WithNames<T>) => ({
  ...formatTransaction(rest as WithTags<T>),
  accountName: account.name,
  categoryName: category?.name ?? null,
})

export const getFormattedTransaction = async (
  id: string,
  prisma: TxClient | typeof pc = pc,
): Promise<ApiTypes.Transaction.TSerialized> => {
  const t = await prisma.transaction.findUniqueOrThrow({
    where: { id },
    include: tagsInclude,
  })
  return formatTransaction(t)
}

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

export type NewTransaction = z.infer<typeof createSchema>
export type TransactionChanges = z.infer<typeof changeSchema>

const toCategoryId = (categoryId: string | null | undefined) =>
  categoryId === undefined ? undefined : categoryId || null

export const createTransaction = async (
  userId: string,
  { categoryId, ...fields }: NewTransaction,
): Promise<ApiTypes.Transaction.CreateResponse> => {
  await assertAccountOwned(fields.accountId, userId)
  if (categoryId) await assertCategoryOwned(categoryId, userId)

  return pc.$transaction(async prisma => {
    const { id } = await prisma.transaction.create({
      data: {
        ...fields,
        id: uuidv7(),
        userId,
        categoryId: toCategoryId(categoryId) ?? null,
      },
    })
    return getFormattedTransaction(id, prisma)
  })
}

export const changeTransaction = async (
  userId: string,
  id: string,
  { categoryId, ...fields }: TransactionChanges,
): Promise<ApiTypes.Transaction.ChangeResponse> => {
  await confirmT(id, userId)
  if (fields.accountId) await assertAccountOwned(fields.accountId, userId)
  if (categoryId) await assertCategoryOwned(categoryId, userId)

  return pc.$transaction(async prisma => {
    await prisma.transaction.update({
      where: { id, userId },
      data: { ...fields, categoryId: toCategoryId(categoryId) },
    })
    return getFormattedTransaction(id, prisma)
  })
}

export const deleteTransaction = async (userId: string, id: string) => {
  await confirmT(id, userId)
  await pc.transaction.delete({ where: { id, userId } })
}

const transactionTags = async (transactionId: string, prisma: TxClient) => {
  const t = await prisma.transaction.findFirstOrThrow({
    include: { tags: { include: { tags: true } } },
    where: { id: transactionId },
  })
  return t.tags.map(tag => ({ id: tag.tagId, name: tag.tags.name }))
}

export const addTransactionTags = async (
  userId: string,
  transactionId: string,
  tags: string[],
) => {
  await confirmT(transactionId, userId)
  return pc.$transaction(async prisma => {
    for (const name of tags) {
      const cleanedName = cleanName(name)
      const tag = await prisma.tags.upsert({
        where: { userId_cleanedName: { userId, cleanedName } },
        update: {},
        create: { id: uuidv7(), userId, name, cleanedName },
      })

      await prisma.transactionsOnTags.upsert({
        where: { transactionId_tagId: { tagId: tag.id, transactionId } },
        update: {},
        create: { tagId: tag.id, transactionId },
      })
    }
    return transactionTags(transactionId, prisma)
  })
}

export const removeTransactionTags = async (
  userId: string,
  transactionId: string,
  names: string[],
) => {
  await confirmT(transactionId, userId)
  return pc.$transaction(async prisma => {
    await prisma.transactionsOnTags.deleteMany({
      where: {
        transactionId,
        tags: { userId, cleanedName: { in: names.map(cleanName) } },
      },
    })
    return transactionTags(transactionId, prisma)
  })
}

/** One transaction with its account, category (budget and spend) and tags. */
export const getTransactionDetail = async (
  userId: string,
  id: string,
): Promise<ApiTypes.Transaction.RetrieveTransactionResponse> => {
  await confirmT(id, userId)
  const t = await pc.transaction.findUniqueOrThrow({
    where: { id, userId },
    ...transactionQueryOpts,
  })
  let category = null
  if (t.category) {
    const month = t.date.slice(0, 7)
    const [categoryMonth, agg] = await Promise.all([
      pc.categoryMonth.findFirst({
        where: { userId, categoryId: t.category.id, month },
      }),
      pc.transaction.aggregate({
        where: { userId, categoryId: t.category.id },
        _sum: { amount: true },
      }),
    ])
    category = {
      ...t.category,
      amount: categoryMonth?.amount ?? 0,
      usedAmount: agg._sum.amount ?? 0,
    }
  }
  return {
    ...formatTransaction(t),
    category,
  } as ApiTypes.Transaction.RetrieveTransactionResponse
}

/** The user's tags with the transactions each is on. */
export const listTagsWithTransactions = async (userId: string) => {
  const tags = await pc.tags.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      transactions: {
        include: {
          transactions: {
            select: { id: true, date: true, payee: true, amount: true },
          },
        },
      },
    },
  })
  return tags.map(t => ({
    id: t.id,
    name: t.name,
    transactions: t.transactions.map(trans => trans.transactions),
  }))
}

/** Money out and money in for the month, across every category. */
export const monthTotals = async (userId: string, month: string) => {
  const sums = await pc.transaction.groupBy({
    by: ["type"],
    where: { userId, date: { gte: month, lt: getNextMonth(month) } },
    _sum: { amount: true },
  })
  const sumOf = (type: string) =>
    sums.find(s => s.type === type)?._sum.amount ?? 0
  return { spent: sumOf("outgoing"), broughtIn: sumOf("incoming") }
}
