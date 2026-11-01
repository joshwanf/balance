import { Suspense } from "react"
import { RecentTransactions } from "@/components/Home/RecentTransactions"
import { RecentTransactionsSkeleton } from "@/components/Home/RecentTransactionsSkeleton"
import {
  MONTH_PARAM,
  monthFromSearchParams,
  pageParam,
  PageSearchParams,
} from "@/utils/month"

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<PageSearchParams>
}) {
  const params = await searchParams
  const month = monthFromSearchParams(pageParam(params, MONTH_PARAM))

  return (
    <Suspense fallback={<RecentTransactionsSkeleton />}>
      <RecentTransactions month={month} />
    </Suspense>
  )
}
