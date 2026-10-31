import { AccountsToolbar } from "@/components/Accounts/AccountsToolbar"
import { CardGridSkeleton } from "@/components/Skeletons/CardGridSkeleton"
import { isPlaidConfigured } from "@/server/plaid/client"

// Same toolbar and grid as the page, so nothing moves when it arrives
export default function Loading() {
  return (
    <div>
      <AccountsToolbar canLinkBank={isPlaidConfigured()} />
      <CardGridSkeleton count={3} />
    </div>
  )
}
