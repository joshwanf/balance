import { Suspense } from "react"
import { CategoryList } from "@/components/Budgets/CategoryList"
import { CategoriesToolbar } from "@/components/Budgets/CategoriesToolbar"
import { CategoryTableSkeleton } from "@/components/Budgets/CategoryTableSkeleton"
import {
  MonthTotals,
  MonthTotalsSkeleton,
} from "@/components/Budgets/MonthTotals"
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
      <CategoriesToolbar
        totals={
          <Suspense fallback={<MonthTotalsSkeleton />}>
            <MonthTotals month={month} />
          </Suspense>
        }
      />
      {/* No key: a month change keeps the old table (dimmed by the shell)
          until the new one arrives, instead of showing the skeleton */}
      <Suspense fallback={<CategoryTableSkeleton />}>
        <CategoryList month={month} />
      </Suspense>
    </div>
  )
}
