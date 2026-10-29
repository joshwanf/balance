import "server-only"
import { Products } from "plaid"
import {
  deleteItemWithAccounts,
  isDemoUser,
  listItemsForUser,
} from "../data/plaid"
import { decryptToken } from "./crypto"
import { isPlaidConfigured, plaidClient } from "./client"
import { removeEmptyItems, storeLinkedItem } from "./link"
import { syncItem } from "./sync"

// First Platypus Bank: a non-OAuth sandbox institution
export const SANDBOX_INSTITUTION = "ins_109508"

/**
 * Links First Platypus Bank to a user without Link. The test user
 * user_transactions_dynamic has six months of recurring data and makes new
 * transactions on every /transactions/refresh.
 */
export const createSandboxItem = async (userId: string) => {
  const { data } = await plaidClient("sandbox").sandboxPublicTokenCreate({
    institution_id: SANDBOX_INSTITUTION,
    initial_products: [Products.Transactions],
    options: {
      override_username: "user_transactions_dynamic",
      override_password: "pass_good",
    },
  })
  return storeLinkedItem({
    userId,
    publicToken: data.public_token,
    environment: "sandbox",
  })
}

/**
 * Keeps the demo user's sandbox bank working. Sandbox items fall into
 * login_required 30 days after creation, so when the demo has no active
 * item, the broken ones are removed (with their accounts) and a fresh one
 * is linked and synced. Does nothing for other users or without Plaid keys.
 */
export const ensureDemoItem = async (userId: string) => {
  if (!isPlaidConfigured() || !(await isDemoUser(userId))) return

  // A bank whose accounts were all deleted doesn't count as working
  await removeEmptyItems(userId)
  const items = await listItemsForUser(userId)
  if (items.some(i => i.status === "active")) return

  for (const item of items) {
    await plaidClient("sandbox")
      .itemRemove({ access_token: decryptToken(item.accessToken) })
      .catch(() => {}) // already gone at Plaid; drop our copy anyway
    await deleteItemWithAccounts(item.id)
  }
  const item = await createSandboxItem(userId)
  await syncItem(item.id)
}
