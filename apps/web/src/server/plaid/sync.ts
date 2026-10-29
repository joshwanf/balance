import "server-only"
import type { RemovedTransaction, Transaction as PlaidTransaction } from "plaid"
import type { PlaidEnvironment } from "../config"
import {
  applySyncRun,
  CursorConflictError,
  getItemById,
  listStaleItemsForUser,
  setItemStatus,
  type ApplySyncResult,
  type SyncedTransaction,
} from "../data/plaid"
import { cleanName } from "../utils/cleanName"
import { isPlaidConfigured, plaidClient } from "./client"
import { decryptToken } from "./crypto"

// Plaid restarts are rare; give up after this many in one run
const MAX_RESTARTS = 3

export type SyncResult =
  | ({ status: "synced" } & ApplySyncResult)
  | { status: "skipped"; reason: "not_found" | "inactive" | "conflict" }
  | { status: "error"; errorCode: string }

/** Plaid category words as Balance category names: "FOOD_AND_DRINK" → "food-and-drink" */
const categoryKey = (words: string) =>
  cleanName(words.replace(/_/g, " ").toLowerCase())

/**
 * Maps a Plaid transaction to Balance's fields, or null to skip it.
 * Plaid amounts are dollars with positive meaning money out of the account.
 */
export const toSyncedTransaction = (
  t: PlaidTransaction,
): SyncedTransaction | null => {
  // The app is USD-only
  if (t.iso_currency_code && t.iso_currency_code !== "USD") return null

  const pfc = t.personal_finance_category
  const categoryKeys: string[] = []
  if (pfc?.detailed && pfc.detailed.startsWith(`${pfc.primary}_`)) {
    // FOOD_AND_DRINK_GROCERIES → "groceries"
    categoryKeys.push(categoryKey(pfc.detailed.slice(pfc.primary.length + 1)))
  }
  if (pfc?.primary) categoryKeys.push(categoryKey(pfc.primary))

  return {
    plaidTransactionId: t.transaction_id,
    plaidAccountId: t.account_id,
    pendingTransactionId: t.pending_transaction_id ?? null,
    type: t.amount > 0 ? "outgoing" : "incoming",
    amount: Math.round(Math.abs(t.amount) * 100),
    date: t.date,
    payee: (t.merchant_name ?? t.name).trim(),
    merchantName: t.merchant_name ?? null,
    pending: t.pending,
    categoryKeys,
  }
}

/** The error_code of a failed Plaid call (the SDK throws axios errors) */
const plaidErrorCode = (e: unknown): string | null => {
  const code = (e as { response?: { data?: { error_code?: unknown } } })
    ?.response?.data?.error_code
  return typeof code === "string" ? code : null
}

/** Every page from `cursor` until has_more is false. */
const fetchAllPages = async (
  environment: PlaidEnvironment,
  accessToken: string,
  cursor: string | null,
) => {
  const client = plaidClient(environment)
  const added: PlaidTransaction[] = []
  const modified: PlaidTransaction[] = []
  const removed: RemovedTransaction[] = []
  let next = cursor ?? undefined
  for (;;) {
    const { data } = await client.transactionsSync({
      access_token: accessToken,
      cursor: next,
      count: 500,
    })
    added.push(...data.added)
    modified.push(...data.modified)
    removed.push(...data.removed)
    next = data.next_cursor
    if (!data.has_more) return { added, modified, removed, nextCursor: next }
  }
}

const mapAll = (ts: PlaidTransaction[]) =>
  ts.map(toSyncedTransaction).filter((t): t is SyncedTransaction => t !== null)

/**
 * Pulls everything new for one item from /transactions/sync and applies it.
 * Safe to call from a webhook, a button and a cron at once: only one run
 * moves the cursor, the others come back as skipped.
 */
export const syncItem = async (itemId: string): Promise<SyncResult> => {
  const item = await getItemById(itemId)
  if (!item) return { status: "skipped", reason: "not_found" }
  if (item.status !== "active") return { status: "skipped", reason: "inactive" }

  const environment = item.environment as PlaidEnvironment
  const accessToken = decryptToken(item.accessToken)

  for (let attempt = 0; ; attempt++) {
    try {
      const pages = await fetchAllPages(environment, accessToken, item.cursor)
      const result = await applySyncRun({
        itemId: item.id,
        fromCursor: item.cursor,
        toCursor: pages.nextCursor,
        page: {
          added: mapAll(pages.added),
          modified: mapAll(pages.modified),
          removed: pages.removed.map(r => r.transaction_id),
        },
      })
      return { status: "synced", ...result }
    } catch (e) {
      if (e instanceof CursorConflictError) {
        return { status: "skipped", reason: "conflict" }
      }
      const code = plaidErrorCode(e)
      // Plaid's data changed mid-run: start again from the saved cursor
      if (
        code === "TRANSACTIONS_SYNC_MUTATION_DURING_PAGINATION" &&
        attempt < MAX_RESTARTS
      ) {
        continue
      }
      if (code === "ITEM_LOGIN_REQUIRED") {
        await setItemStatus(item.id, "login_required")
      }
      if (code) return { status: "error", errorCode: code }
      throw e
    }
  }
}

// How old a sync can get before opening the Accounts page triggers another
const STALE_AFTER_MS = 12 * 60 * 60 * 1000

/** Syncs the user's items not synced in 12 hours; a backstop for missed webhooks. */
export const syncStaleItems = async (userId: string) => {
  if (!isPlaidConfigured()) return
  const stale = await listStaleItemsForUser(
    userId,
    new Date(Date.now() - STALE_AFTER_MS),
  )
  for (const item of stale) await syncItem(item.id)
}
