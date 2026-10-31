/** Grey placeholder Pie chart shown while it loads. */
export const PieChartSkeleton = () => {
  return (
    <div
      className="w-full animate-pulse"
      aria-busy="true"
      aria-label="Loading chart"
    >
      <div className="h-6 mb-4 mx-auto w-32 rounded bg-brand-100"></div>
      <div className="aspect-square rounded-full bg-brand-100" />
      <div className="h-10 mt-4 rounded bg-brand-100"></div>
    </div>
  )
}
