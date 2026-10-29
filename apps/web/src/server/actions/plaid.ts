"use server"
import { getItemForUser } from "@/server/data"
import { userMutation } from "@/server/mutation"
import { isPlaidConfigured, plaidClient } from "@/server/plaid/client"
import { decryptToken } from "@/server/plaid/crypto"
import { syncItem } from "@/server/plaid/sync"

export type SyncNowState =
  | { status: "success"; added: number; modified: number; removed: number }
  | { status: "error"; error: string }

/**
 * Pulls new transactions for one of the user's bank connections. For a
 * sandbox item it first asks Plaid to generate new test transactions.
 */
export const syncNowAction = async (itemId: string): Promise<SyncNowState> =>
  userMutation(async user => {
    if (!isPlaidConfigured()) {
      return { status: "error", error: "Bank syncing isn't set up." }
    }
    const item = await getItemForUser(itemId, user.id)
    if (!item) return { status: "error", error: "Couldn't find that bank." }

    if (item.environment === "sandbox") {
      await plaidClient("sandbox")
        .transactionsRefresh({ access_token: decryptToken(item.accessToken) })
        .catch(() => {})
    }

    const result = await syncItem(item.id)
    switch (result.status) {
      case "synced":
        return {
          status: "success",
          added: result.added + result.merged,
          modified: result.modified,
          removed: result.removed,
        }
      case "skipped":
        return result.reason === "conflict"
          ? { status: "success", added: 0, modified: 0, removed: 0 }
          : { status: "error", error: "This bank needs to be reconnected." }
      case "error":
        return result.errorCode === "ITEM_LOGIN_REQUIRED"
          ? { status: "error", error: "This bank needs to be reconnected." }
          : { status: "error", error: "Couldn't reach the bank. Try again." }
    }
  })
