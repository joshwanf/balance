import { PieChartSkeleton } from "@/components/Skeletons/PieChartSkeleton"
import { COMPARE_GRID_CLASS } from "@/components/Trends/Compare/Compare"

export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="h-5 w-40 rounded bg-grass-100 animate-pulse" />
      <div className="h-24 rounded-2xl bg-grass-100 animate-pulse" />
      <div className={COMPARE_GRID_CLASS}>
        <PieChartSkeleton />
        <PieChartSkeleton />
      </div>
    </div>
  )
}
