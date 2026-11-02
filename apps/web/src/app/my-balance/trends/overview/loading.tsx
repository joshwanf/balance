import { BarChartSkeleton } from "@/components/Skeletons/BarChartSkeleton"
import { OVERVIEW_CHART_CLASS } from "@/components/Trends/Overview/Overview"

export default function Loading() {
  return (
    <div className="max-w-3xl space-y-4">
      <div className="h-5 w-40 rounded bg-brand-100 animate-pulse" />
      <div className="h-9 w-36 rounded-lg bg-brand-100 animate-pulse" />
      <div className="h-6 w-3/4 rounded bg-brand-100 animate-pulse" />
      <div className={OVERVIEW_CHART_CLASS}>
        <BarChartSkeleton />
      </div>
    </div>
  )
}
