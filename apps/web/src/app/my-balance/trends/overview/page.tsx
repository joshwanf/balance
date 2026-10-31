import {
  MONTH_PARAM,
  monthFromSearchParams,
  pageParam,
  PageSearchParams,
  OVERVIEW_RANGE_PARAM,
  rangeFromSearchParams,
} from "@/utils/month"
import { MonthRangeSelector } from "@/components/Trends/Overview/MonthRangeSelector"
import {
  Overview,
  OVERVIEW_CHART_CLASS,
} from "@/components/Trends/Overview/Overview"
import { TrendsBreadcrumb } from "@/components/Trends/TrendsBreadcrumb"
import { BarChartSkeleton } from "@/components/Skeletons/BarChartSkeleton"
import { Suspense } from "react"

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<PageSearchParams>
}) {
  const currentQuery = await searchParams
  const month = monthFromSearchParams(pageParam(currentQuery, MONTH_PARAM))
  const curRange = rangeFromSearchParams(
    pageParam(currentQuery, OVERVIEW_RANGE_PARAM),
  )

  return (
    <div className="max-w-3xl space-y-4">
      <TrendsBreadcrumb month={month} current="Overview" />
      <MonthRangeSelector currentQuery={currentQuery} curRange={curRange} />
      <Suspense
        key={`${month}|${curRange}`}
        fallback={
          <div className={OVERVIEW_CHART_CLASS}>
            <BarChartSkeleton />
          </div>
        }
      >
        <Overview month={month} range={curRange} />
      </Suspense>
    </div>
  )
}
