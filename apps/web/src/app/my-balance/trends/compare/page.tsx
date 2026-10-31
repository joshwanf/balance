import { PieChartSkeleton } from "@/components/Skeletons/PieChartSkeleton"
import {
  Compare,
  COMPARE_GRID_CLASS,
} from "@/components/Trends/Compare/Compare"
import { TrendsBreadcrumb } from "@/components/Trends/TrendsBreadcrumb"
import { CompareMonthSelector } from "@/components/Trends/Compare/CompareMonthSelector"
import {
  COMPARE_MONTH1_PARAM,
  COMPARE_MONTH2_PARAM,
  compareMonthsFromSearchParams,
  MONTH_PARAM,
  monthFromSearchParams,
  pageParam,
  PageSearchParams,
} from "@/utils/month"
import { Suspense } from "react"

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<PageSearchParams>
}) {
  const params = await searchParams
  const selectedMonth = monthFromSearchParams(pageParam(params, MONTH_PARAM))
  const { month1, month2 } = compareMonthsFromSearchParams(
    selectedMonth,
    pageParam(params, COMPARE_MONTH1_PARAM),
    pageParam(params, COMPARE_MONTH2_PARAM),
  )
  return (
    <div className="space-y-4">
      <TrendsBreadcrumb month={selectedMonth} current="Compare" />

      <CompareMonthSelector
        key={`selector-${month1}|${month2}`}
        compareMonth1={month1}
        compareMonth2={month2}
        month={selectedMonth}
      />

      <Suspense
        key={`${month1}|${month2}`}
        fallback={
          <div className={COMPARE_GRID_CLASS}>
            <PieChartSkeleton />
            <PieChartSkeleton />
          </div>
        }
      >
        <Compare month1={month1} month2={month2} />
      </Suspense>
    </div>
  )
}
