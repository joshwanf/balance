import { Suspense } from "react"
import { CategoryList } from "@/components/Budgets/CategoryList"
import { TableSkeleton } from "@/components/Skeletons/TableSkeleton"
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
    // A new key shows the shimmer again when the month changes
    <Suspense key={month} fallback={<TableSkeleton rows={8} cols={4} />}>
      <CategoryList month={month} />
    </Suspense>
  )
}
