import { PieChartSkeleton } from "@/components/Skeletons/PieChartSkeleton"

export default function Loading() {
  return (
    <div className="flex">
      <PieChartSkeleton />
      <PieChartSkeleton />
    </div>
  )
}
