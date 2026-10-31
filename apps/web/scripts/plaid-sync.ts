/**
 * Runs the Plaid sync by hand against Sandbox.
 *
 *   yarn plaid:sync link-sandbox <username>   link First Platypus Bank to a user, then sync
 *   yarn plaid:sync sync <item id>            sync one PlaidItem (its Balance id)
 *   yarn plaid:sync sync all                  sync every active item
 *
 * Reads apps/web/.env. Needs PLAID_CLIENT_ID, PLAID_SECRET_SANDBOX and PLAID_TOKEN_KEY.
 */
import { pc } from "../src/server/prisma"
import { listActiveItems } from "../src/server/data/plaid"
import { createSandboxItem } from "../src/server/plaid/demo"
import { syncItem } from "../src/server/plaid/sync"

const linkSandbox = async (username: string) => {
  const user = await pc.user.findUnique({ where: { username } })
  if (!user) throw new Error(`No user named ${username}`)
  const item = await createSandboxItem(user.id)
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
