import { Suspense } from "react"
import { TransactionsList } from "@/components/Transactions/TransactionsList"
import { TransactionsToolbar } from "@/components/Transactions/TransactionsToolbar"
import { TableSkeleton } from "@/components/Skeletons/TableSkeleton"
import {
  TRANSACTION_COLUMNS,
  TRANSACTIONS_MIN_WIDTH,
} from "@/components/Transactions/columns"
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
      {/* No key: a month or search change keeps the old rows (dimmed by the
          shell) until the new ones arrive, instead of showing the skeleton */}
      <Suspense
        fallback={
          <TableSkeleton
            columns={TRANSACTION_COLUMNS}
            minWidth={TRANSACTIONS_MIN_WIDTH}
          />
        }
      >
        <TransactionsList month={month} searchText={searchText} />
      </Suspense>
    </div>
  )
}
