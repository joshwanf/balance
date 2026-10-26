import { PieChartSkeleton } from "@/components/Skeletons/PieChartSkeleton"
import { Compare } from "@/components/Trends/Compare/Compare"
import { CompareMonthSelector } from "@/components/Trends/Compare/CompareMonthSelector"
import {
  COMPARE_MONTH1_PARAM,
  COMPARE_MONTH2_PARAM,
  compareMonthsFromSearchParams,
  MONTH_PARAM,
  monthFromSearchParams,
  pageParam,
  PageSearchParams,
  withMonth,
} from "@/utils/month"
import Link from "next/link"
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
    <>
      <div>
        <Link href={withMonth("/my-balance/trends", selectedMonth)}>
          Trends
        </Link>{" "}
        &gt;{" "}
        <Link href={withMonth("/my-balance/trends/compare", selectedMonth)}>
          Compare
        </Link>
      </div>

      <CompareMonthSelector
        key={`selector-${month1}|${month2}`}
        compareMonth1={month1}
        compareMonth2={month2}
        month={selectedMonth}
      />

      <Suspense
        key={`${month1}|${month2}`}
        fallback={
          <div className="flex gap-8">
            <PieChartSkeleton />
            <PieChartSkeleton />
          </div>
        }
      >
        <Compare month1={month1} month2={month2} />
      </Suspense>
    </>
  )
}
