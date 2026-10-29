import "server-only"
import moment from "moment"
import { uuidv7 } from "uuidv7"
import { z } from "zod"
import type { ApiTypes } from "@balance/api-types"
import { pc, TxClient } from "../prisma"
import { confirmT, getCategoriesWithTransAgg } from "../queries"
import {
  assertAccountOwned,
  assertCategoryOwned,
  changeSchema,
  createSchema,
  formatRow,
  getFormattedTransaction,
  rowInclude,
} from "../transactions"
import { cleanName } from "../utils/cleanName"

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
