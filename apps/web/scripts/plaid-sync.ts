/**
 * Runs the Plaid sync by hand against Sandbox.
 *
 *   yarn plaid:sync link-sandbox <username>   link First Platypus Bank to a user, then sync
 *   yarn plaid:sync sync <item id>            sync one PlaidItem (its Balance id)
 *   yarn plaid:sync sync all                  sync every active item
 *   yarn plaid:sync reset-login <item id>     make a Sandbox item ask for sign-in again
 *
 * Reads apps/web/.env. Needs PLAID_CLIENT_ID, PLAID_SECRET_SANDBOX and PLAID_TOKEN_KEY.
 */
import { pc } from "../src/server/prisma"
import { getItemById, listActiveItems } from "../src/server/data/plaid"
import { plaidClient } from "../src/server/plaid/client"
import { decryptToken } from "../src/server/plaid/crypto"
import { createSandboxItem } from "../src/server/plaid/demo"
import { syncItem } from "../src/server/plaid/sync"

const linkSandbox = async (username: string) => {
  const user = await pc.user.findUnique({ where: { username } })
  if (!user) throw new Error(`No user named ${username}`)
  const item = await createSandboxItem(user.id)
  console.log(`Linked item ${item.id} (${item.institutionName})`)
  return item.id
}

// Plaid only reports the broken login on the next call, so sync straight
// away to record it as login_required
const resetLogin = async (itemId: string) => {
  const item = await getItemById(itemId)
  if (!item) throw new Error(`No item ${itemId}`)
  if (item.environment !== "sandbox") throw new Error("Only Sandbox items")
  await plaidClient("sandbox").sandboxItemResetLogin({
    access_token: decryptToken(item.accessToken),
  })
  console.log(await syncItem(item.id))
}

const main = async () => {
  const [command, arg] = process.argv.slice(2)
  if (command === "link-sandbox" && arg) {
    const itemId = await linkSandbox(arg)
    // Plaid often has nothing on the very first call; run sync again shortly
    console.log(await syncItem(itemId))
  } else if (command === "sync" && arg === "all") {
    for (const item of await listActiveItems()) {
      console.log(item.id, await syncItem(item.id))
    }
  } else if (command === "sync" && arg) {
    console.log(await syncItem(arg))
  } else if (command === "reset-login" && arg) {
    await resetLogin(arg)
  } else {
    console.log(
      "Usage: yarn plaid:sync link-sandbox <username> | sync <item id|all> | reset-login <item id>",
    )
    process.exitCode = 1
  }
}

main()
  .catch(e => {
    console.error(e?.response?.data ?? e)
    process.exitCode = 1
  })
  .finally(() => pc.$disconnect())
