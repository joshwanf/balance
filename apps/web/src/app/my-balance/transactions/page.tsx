import { Suspense } from "react"
import { TransactionsList } from "@/components/Transactions/TransactionsList"
import { TransactionsToolbar } from "@/components/Transactions/TransactionsToolbar"
import { TableSkeleton } from "@/components/Skeletons/TableSkeleton"
import {
  MONTH_PARAM,
  SEARCH_PARAM,
  monthFromSearchParams,
  pageParam,
  type PageSearchParams,
} from "@/utils/month"

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<PageSearchParams>
}) {
  const params = await searchParams
  const month = monthFromSearchParams(pageParam(params, MONTH_PARAM))
  const searchText = pageParam(params, SEARCH_PARAM) ?? ""

  return (
    <div>
      <TransactionsToolbar />
      {/* A new key shows the shimmer again when the month or search changes */}
      <Suspense key={`${month}|${searchText}`} fallback={<TableSkeleton />}>
        <TransactionsList month={month} searchText={searchText} />
      </Suspense>
    </div>
  )
}
