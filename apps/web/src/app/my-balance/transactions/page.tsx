import { Suspense } from "react"
import { TransactionsList } from "@/components/Transactions/TransactionsList"
import { TransactionsToolbar } from "@/components/Transactions/TransactionsToolbar"
import { TableSkeleton } from "@/components/Skeletons/TableSkeleton"
import { MONTH_PARAM, SEARCH_PARAM, monthFromSearchParams } from "@/utils/month"

type SearchParams = Promise<Record<string, string | string[] | undefined>>

const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const params = await searchParams
  const month = monthFromSearchParams(first(params[MONTH_PARAM]))
  const searchText = first(params[SEARCH_PARAM]) ?? ""

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
