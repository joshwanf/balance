/** Grey placeholder Pie chart shown while it loads. */
export const PieChartSkeleton = () => {
  return (
    <div
      className="w-full animate-pulse"
      aria-busy="true"
      aria-label="Loading chart"
    >
      <div className="h-4 mb-4 bg-grass-100"></div>
      <div className="aspect-square rounded-full bg-grass-100" />
    </div>
  )
}
