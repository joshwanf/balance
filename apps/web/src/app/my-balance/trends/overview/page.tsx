import {
  MONTH_PARAM,
  monthFromSearchParams,
  pageParam,
  PageSearchParams,
  OVERVIEW_RANGE_PARAM,
  rangeFromSearchParams,
  withMonth,
} from "@/utils/month"
import Link from "next/link"
import { MonthRangeSelector } from "@/components/Trends/Overview/MonthRangeSelector"
import { Overview } from "@/components/Trends/Overview/Overview"
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
    <div>
      <div>
        <Link href={withMonth("/my-balance/trends", month)}>Trends</Link> &gt;{" "}
        <Link href={withMonth("/my-balance/trends/overview", month)}>
          Overview
        </Link>
      </div>

      <MonthRangeSelector currentQuery={currentQuery} curRange={curRange} />

      <div className="w-1/2">
        <Suspense key={`${month}|${curRange}`} fallback={<BarChartSkeleton />}>
          <Overview month={month} range={curRange} />
        </Suspense>
      </div>
    </div>
  )
}
