"use server"
import { after } from "next/server"
import { CountryCode, Products } from "plaid"
import config from "@/server/config"
import { requireUser } from "@/server/auth"
import {
  countItemsForUser,
  getItemForUser,
  isDemoUser,
  setItemStatus,
} from "@/server/data"
import { userMutation } from "@/server/mutation"
import { isPlaidConfigured, plaidClient } from "@/server/plaid/client"
import { linkEnvironmentFor, storeLinkedItem } from "@/server/plaid/link"
import { decryptToken } from "@/server/plaid/crypto"
import type { PlaidEnvironment } from "@/server/config"
import { refreshSandboxItem, syncItem } from "@/server/plaid/sync"

// The shared demo account keeps its own bank plus this many from visitors
const DEMO_EXTRA_BANKS = 2

/** Why this user can't link another bank right now, or null if they can. */
const linkBlocker = async (userId: string) => {
  if (!isPlaidConfigured()) return "Bank linking isn't set up."
  if (
    (await isDemoUser(userId)) &&
    (await countItemsForUser(userId)) >= 1 + DEMO_EXTRA_BANKS
  ) {
    return `The demo can link up to ${DEMO_EXTRA_BANKS} extra test banks. Log in with your own account to add more.`
  }
  return null
}

export type LinkTokenState =
  | { status: "success"; linkToken: string }
  | { status: "error"; error: string }

/** A short-lived token for opening Plaid Link in the browser. */
export const createLinkTokenAction = async (): Promise<LinkTokenState> => {
  const user = await requireUser()
  const blocker = await linkBlocker(user.id)
  if (blocker) return { status: "error", error: blocker }

  try {
    const environment = await linkEnvironmentFor(user.id)
    const { data } = await plaidClient(environment).linkTokenCreate({
      user: { client_user_id: user.id },
      client_name: "Balance",
      products: [Products.Transactions],
      country_codes: [CountryCode.Us],
      language: "en",
      webhook: config.plaid?.webhookUrl ?? undefined,
      transactions: { days_requested: 90 },
    })
    return { status: "success", linkToken: data.link_token }
  } catch (e) {
    console.error(e)
    return { status: "error", error: "Couldn't start bank linking." }
  }
}

export type ExchangeState =
  | { status: "success"; institutionName: string | null; accounts: number }
  | { status: "error"; error: string }

/**
 * Stores the bank the user just linked, with its checking, savings and
 * credit card accounts, then imports transactions once the response is sent.
 */
export const exchangePublicTokenAction = async (
  publicToken: string,
): Promise<ExchangeState> =>
  userMutation(async user => {
    const blocker = await linkBlocker(user.id)
    if (blocker) return { status: "error", error: blocker }

    try {
      const item = await storeLinkedItem({
        userId: user.id,
        publicToken,
        environment: await linkEnvironmentFor(user.id),
      })
      after(() => syncItem(item.id).catch(console.error))
      return {
        status: "success",
        institutionName: item.institutionName,
        accounts: item.accountCount,
      }
    } catch (e) {
      console.error(e)
      return { status: "error", error: "Couldn't link that bank." }
    }
  })

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

    await refreshSandboxItem(item)
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

/**
 * A link token that opens Plaid Link in update mode for one of the user's
 * banks, so they can sign in again when Plaid says the login has expired.
 */
export const createReconnectTokenAction = async (
  itemId: string,
): Promise<LinkTokenState> => {
  const user = await requireUser()
  if (!isPlaidConfigured()) {
    return { status: "error", error: "Bank linking isn't set up." }
  }
  const item = await getItemForUser(itemId, user.id)
  if (!item) return { status: "error", error: "Couldn't find that bank." }

  try {
    const { data } = await plaidClient(
      item.environment as PlaidEnvironment,
    ).linkTokenCreate({
      user: { client_user_id: user.id },
      client_name: "Balance",
      access_token: decryptToken(item.accessToken),
      country_codes: [CountryCode.Us],
      language: "en",
      webhook: config.plaid?.webhookUrl ?? undefined,
    })
    return { status: "success", linkToken: data.link_token }
  } catch (e) {
    console.error(e)
    return { status: "error", error: "Couldn't start reconnecting." }
  }
}

/** After the user signs in again in Plaid Link: mark the bank healthy and sync */
export const finishReconnectAction = async (
  itemId: string,
): Promise<{ status: "success" } | { status: "error"; error: string }> =>
  userMutation(async user => {
    const item = await getItemForUser(itemId, user.id)
    if (!item) return { status: "error", error: "Couldn't find that bank." }
    await setItemStatus(item.id, "active")
    after(() => syncItem(item.id).catch(console.error))
    return { status: "success" }
  })
