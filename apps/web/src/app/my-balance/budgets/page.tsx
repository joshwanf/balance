import { Suspense } from "react"
import { CategoryList } from "@/components/Budgets/CategoryList"
import { TableSkeleton } from "@/components/Skeletons/TableSkeleton"
import {
  CATEGORY_COLUMNS,
  CATEGORIES_MIN_WIDTH,
} from "@/components/Budgets/columns"
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
    // No key: a month change keeps the old table (dimmed by the shell) until
    // the new one arrives, instead of showing the skeleton
    <Suspense
      fallback={
        <TableSkeleton
          columns={CATEGORY_COLUMNS}
          minWidth={CATEGORIES_MIN_WIDTH}
          rows={8}
        />
      }
    >
      <CategoryList month={month} />
    </Suspense>
  )
}
