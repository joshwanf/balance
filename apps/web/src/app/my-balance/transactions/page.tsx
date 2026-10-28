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
import { getSessionUser } from "@/server/auth"
import { listAccounts } from "@/server/data"

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<PageSearchParams>
}) {
  const params = await searchParams
  const month = monthFromSearchParams(pageParam(params, MONTH_PARAM))
  const searchText = pageParam(params, SEARCH_PARAM) ?? ""

  const user = await getSessionUser()
  if (!user) return null

  const accounts = (await listAccounts(user.id, month)).map(a => ({
    id: a.id,
    name: a.name,
  }))

  return (
    <div>
      <TransactionsToolbar accounts={accounts} />
      {/* A new key shows the shimmer again when the month or search changes */}
      <Suspense key={`${month}|${searchText}`} fallback={<TableSkeleton />}>
        <TransactionsList
          accounts={accounts}
          month={month}
          searchText={searchText}
        />
      </Suspense>
    </div>
  )
}
