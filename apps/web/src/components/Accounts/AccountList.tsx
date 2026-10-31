import { after } from "next/server"
import { getSessionUser } from "@/server/auth"
import { listAccounts } from "@/server/data"
import { ensureDemoItem } from "@/server/plaid/demo"
import { syncStaleItems } from "@/server/plaid/sync"
import { AccountCard } from "./AccountCard"

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

  if (accounts.length === 0) {
    return (
      <p className="py-8 text-center text-slate-500">
        No accounts yet. Add one or link a bank above.
      </p>
    )
  }

  return (
    // one column on phones, two from sm, three from lg (CardGridSkeleton matches)
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {accounts.map(a => (
        <AccountCard key={a.id} account={a} />
      ))}
    </div>
  )
}
