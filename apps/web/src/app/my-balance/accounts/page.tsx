import { Suspense } from "react"
import { AccountList } from "@/components/Accounts/AccountList"
import { CardGridSkeleton } from "@/components/Skeletons/CardGridSkeleton"
import { AccountsToolbar } from "@/components/Accounts/AccountsToolbar"
import { isPlaidConfigured } from "@/server/plaid/client"
import {
  MONTH_PARAM,
  monthFromSearchParams,
  pageParam,
  type PageSearchParams,
} from "@/utils/month"

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<PageSearchParams>
}) {
  const month = monthFromSearchParams(
    pageParam(await searchParams, MONTH_PARAM),
  )
  return (
    <div>
      <AccountsToolbar canLinkBank={isPlaidConfigured()} />
      {/* No key: a month change keeps the old grid (dimmed by the shell)
          until the new one arrives, instead of showing the skeleton */}
      <Suspense fallback={<CardGridSkeleton count={3} />}>
        <AccountList month={month} />
      </Suspense>
    </div>
  )
}
