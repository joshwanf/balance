import "server-only"
import moment from "moment"
import { uuidv7 } from "uuidv7"
import type { PlaidEnvironment } from "../config"
import { pc } from "../prisma"
import { cleanName } from "../utils/cleanName"

export type PlaidItemStatus = "active" | "login_required" | "error" | "revoked"

/** A Plaid transaction already mapped to Balance's fields (see plaid/sync.ts) */
export interface SyncedTransaction {
  plaidTransactionId: string
  plaidAccountId: string
  /** Set when this posted transaction replaces a pending one we hold */
  pendingTransactionId: string | null
  type: "incoming" | "outgoing"
  amount: number // cents, always positive
  date: string // YYYY-MM-DD
  payee: string
  merchantName: string | null
  pending: boolean
  /** Category names to try, most specific first, e.g. ["groceries", "food-and-drink"] */
  categoryKeys: string[]
}

export interface SyncPage {
  added: SyncedTransaction[]
  modified: SyncedTransaction[]
  removed: string[] // plaid transaction ids
}

export interface LinkedAccount {
  plaidAccountId: string
  name: string
  accountType: "checking" | "savings" | "credit"
  mask: string | null
}

/** Thrown when another sync moved the cursor first; nothing was written. */
export class CursorConflictError extends Error {
  constructor() {
    super("Plaid cursor changed during sync")
  }
}

// A manual row this close in date (same account, amount and type) is merged
const SURE_MATCH_DAYS = 3
// Within this many days (any account) it is only flagged as a possible duplicate
const MAYBE_MATCH_DAYS = 7

export const getItemById = (id: string) =>
  pc.plaidItem.findUnique({ where: { id } })

export const getItemByPlaidId = (plaidItemId: string) =>
  pc.plaidItem.findUnique({ where: { plaidItemId } })

/** The item, only if it belongs to the user. */
export const getItemForUser = (id: string, userId: string) =>
  pc.plaidItem.findFirst({ where: { id, userId } })

export const listActiveItems = () =>
  pc.plaidItem.findMany({ where: { status: "active" } })

export const listItemsForUser = (userId: string) =>
  pc.plaidItem.findMany({ where: { userId }, orderBy: { createdAt: "asc" } })

/** Active items not synced since `before` (or never synced). */
export const listStaleItemsForUser = (userId: string, before: Date) =>
  pc.plaidItem.findMany({
    where: {
      userId,
      status: "active",
      OR: [{ lastSyncedAt: null }, { lastSyncedAt: { lt: before } }],
    },
  })

export const isDemoUser = async (userId: string) =>
  (await pc.user.findUnique({ where: { id: userId }, select: { isDemo: true } }))
    ?.isDemo ?? false

/** Stores a new connection and one Account row per chosen Plaid account. */
export const createItemWithAccounts = async (input: {
  userId: string
  plaidItemId: string
  accessToken: string // already encrypted
  environment: PlaidEnvironment
  institutionId: string | null
  institutionName: string | null
  accounts: LinkedAccount[]
}) =>
  pc.$transaction(async prisma => {
    const item = await prisma.plaidItem.create({
      data: {
        id: uuidv7(),
        userId: input.userId,
        plaidItemId: input.plaidItemId,
        accessToken: input.accessToken,
        environment: input.environment,
        institutionId: input.institutionId,
        institutionName: input.institutionName,
      },
    })
    await prisma.account.createMany({
      data: input.accounts.map(a => ({
        id: uuidv7(),
        userId: input.userId,
        name: a.name,
        cleanedName: cleanName(a.name),
        accountType: a.accountType,
        mask: a.mask,
        plaidItemId: item.id,
        plaidAccountId: a.plaidAccountId,
      })),
    })
    return item
  })

export const setItemStatus = (id: string, status: PlaidItemStatus) =>
  pc.plaidItem.update({ where: { id }, data: { status } })

/** Deletes the item; its accounts and transactions stay, as manual ones. */
export const deleteItem = (id: string) =>
  pc.plaidItem.delete({ where: { id } })

/** Deletes the item with its accounts and their transactions (demo resets only). */
export const deleteItemWithAccounts = (id: string) =>
  pc.$transaction([
    pc.account.deleteMany({ where: { plaidItemId: id } }),
    pc.plaidItem.delete({ where: { id } }),
  ])

const shiftDate = (date: string, days: number) =>
  moment(date).add(days, "days").format("YYYY-MM-DD")

const daysApart = (a: string, b: string) =>
  Math.abs(moment(a).diff(moment(b), "days"))

/**
 * Applies one full sync run (every page from `fromCursor` to `toCursor`)
 * in a single transaction. The cursor only moves if it still equals
 * `fromCursor`, so when two syncs race the loser writes nothing.
 */
export const applySyncRun = async (input: {
  itemId: string
  fromCursor: string | null
  toCursor: string
  page: SyncPage
}) =>
  pc.$transaction(
    async prisma => {
      const moved = await prisma.plaidItem.updateMany({
        where: { id: input.itemId, cursor: input.fromCursor },
        data: { cursor: input.toCursor, lastSyncedAt: new Date() },
      })
      if (moved.count === 0) throw new CursorConflictError()

      const item = await prisma.plaidItem.findUniqueOrThrow({
        where: { id: input.itemId },
        include: { accounts: { select: { id: true, plaidAccountId: true } } },
      })
      const accountIds = new Map(
        item.accounts.map(a => [a.plaidAccountId, a.id] as const),
      )
      const categories = await prisma.category.findMany({
        where: { userId: item.userId },
        select: { id: true, cleanedName: true },
      })
      const categoryIds = new Map(
        categories.map(c => [c.cleanedName, c.id] as const),
      )
      const findCategory = (keys: string[]) =>
        keys.map(k => categoryIds.get(k)).find(id => id !== undefined) ??
        null

      const counts = { added: 0, merged: 0, flagged: 0, modified: 0, removed: 0 }
      // Manual rows merged in this run, so one can't absorb two imports
      const usedManualIds = new Set<string>()

      // Added before removed: a pending row that posts arrives as "added"
      // (pointing back at it) plus "removed", and is updated in place
      for (const t of input.page.added) {
        const accountId = accountIds.get(t.plaidAccountId)
        if (!accountId) continue // an account the user didn't link

        const synced = {
          type: t.type,
          amount: t.amount,
          date: t.date,
          pending: t.pending,
          merchantName: t.merchantName,
        }

        const existing = await prisma.transaction.findFirst({
          where: {
            userId: item.userId,
            plaidTransactionId: {
              in: [t.plaidTransactionId, t.pendingTransactionId].filter(
                (id): id is string => id !== null,
              ),
            },
          },
          select: { id: true },
        })
        if (existing) {
          await prisma.transaction.update({
            where: { id: existing.id },
            data: { ...synced, plaidTransactionId: t.plaidTransactionId },
          })
          counts.modified++
          continue
        }

        const candidates = await prisma.transaction.findMany({
          where: {
            userId: item.userId,
            plaidTransactionId: null,
            amount: t.amount,
            type: t.type,
            date: {
              gte: shiftDate(t.date, -MAYBE_MATCH_DAYS),
              lte: shiftDate(t.date, MAYBE_MATCH_DAYS),
            },
            id: { notIn: [...usedManualIds] },
          },
          select: { id: true, accountId: true, date: true },
        })
        const byCloseness = candidates.sort(
          (a, b) => daysApart(a.date, t.date) - daysApart(b.date, t.date),
        )
        const sure = byCloseness.find(
          c =>
            c.accountId === accountId &&
            daysApart(c.date, t.date) <= SURE_MATCH_DAYS,
        )
        if (sure) {
          // Keep the user's payee, category, tags and date
          await prisma.transaction.update({
            where: { id: sure.id },
            data: {
              plaidTransactionId: t.plaidTransactionId,
              pending: t.pending,
              merchantName: t.merchantName,
            },
          })
          usedManualIds.add(sure.id)
          counts.merged++
          continue
        }

        const maybe = byCloseness.at(0)
        await prisma.transaction.create({
          data: {
            id: uuidv7(),
            userId: item.userId,
            accountId,
            categoryId: findCategory(t.categoryKeys),
            ...synced,
            payee: t.payee,
            source: "plaid",
            plaidTransactionId: t.plaidTransactionId,
            possibleDuplicateOfId: maybe?.id ?? null,
          },
        })
        counts.added++
        if (maybe) counts.flagged++
      }

      // Payee, category and tags belong to the user after the first import
      for (const t of input.page.modified) {
        const { count } = await prisma.transaction.updateMany({
          where: { userId: item.userId, plaidTransactionId: t.plaidTransactionId },
          data: {
            type: t.type,
            amount: t.amount,
            date: t.date,
            pending: t.pending,
            merchantName: t.merchantName,
          },
        })
        counts.modified += count
      }

      if (input.page.removed.length > 0) {
        const where = {
          userId: item.userId,
          plaidTransactionId: { in: input.page.removed },
        }
        // Rows the user typed in survive as plain manual transactions
        await prisma.transaction.updateMany({
          where: { ...where, source: "manual" },
          data: { plaidTransactionId: null, pending: false, merchantName: null },
        })
        const { count } = await prisma.transaction.deleteMany({
          where: { ...where, source: "plaid" },
        })
        counts.removed = count
      }

      return counts
    },
    { timeout: 30_000 },
  )

export type ApplySyncResult = Awaited<ReturnType<typeof applySyncRun>>
