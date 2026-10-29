import { after } from "next/server"
import { getSessionUser } from "@/server/auth"
import { listAccounts } from "@/server/data"
import { ensureDemoItem } from "@/server/plaid/demo"
import { syncStaleItems } from "@/server/plaid/sync"
import { AccountCard } from "./AccountCard"
import { CreateAccountCard } from "./CreateAccountCard"

interface Props {
  month: string
}

/** Fetches the user's accounts on the server and renders the grid. */
export const AccountList = async ({ month }: Props) => {
  const user = await getSessionUser()
  if (!user) return null
  const accounts = await listAccounts(user.id, month)

  after(async () => {
    try {
      await ensureDemoItem(user.id)
      await syncStaleItems(user.id)
    } catch (e) {
      console.error(e)
    }
  })

  return (
    <div className="grid grid-cols-3 gap-5">
      {accounts.map(a => (
        <AccountCard key={a.id} account={a} />
      ))}
      <CreateAccountCard />
    </div>
  )
}
