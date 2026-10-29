/**
 * Runs the Plaid sync by hand against Sandbox.
 *
 *   yarn plaid:sync link-sandbox <username>   link First Platypus Bank to a user, then sync
 *   yarn plaid:sync sync <item id>            sync one PlaidItem (its Balance id)
 *   yarn plaid:sync sync all                  sync every active item
 *
 * Reads apps/web/.env. Needs PLAID_CLIENT_ID, PLAID_SECRET_SANDBOX and PLAID_TOKEN_KEY.
 */
import { Products } from "plaid"
import { pc } from "../src/server/prisma"
import { listActiveItems } from "../src/server/data/plaid"
import { plaidClient } from "../src/server/plaid/client"
import { storeLinkedItem } from "../src/server/plaid/link"
import { syncItem } from "../src/server/plaid/sync"

// First Platypus Bank: a non-OAuth sandbox institution
const SANDBOX_INSTITUTION = "ins_109508"

const linkSandbox = async (username: string) => {
  const user = await pc.user.findUnique({ where: { username } })
  if (!user) throw new Error(`No user named ${username}`)

  const { data } = await plaidClient("sandbox").sandboxPublicTokenCreate({
    institution_id: SANDBOX_INSTITUTION,
    initial_products: [Products.Transactions],
    options: {
      // Recurring data that grows on each /transactions/refresh
      override_username: "user_transactions_dynamic",
      override_password: "pass_good",
    },
  })
  const item = await storeLinkedItem({
    userId: user.id,
    publicToken: data.public_token,
    environment: "sandbox",
  })
  console.log(`Linked item ${item.id} (${item.institutionName})`)
  return item.id
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
  } else {
    console.log("Usage: yarn plaid:sync link-sandbox <username> | sync <item id|all>")
    process.exitCode = 1
  }
}

main()
  .catch(e => {
    console.error(e?.response?.data ?? e)
    process.exitCode = 1
  })
  .finally(() => pc.$disconnect())
