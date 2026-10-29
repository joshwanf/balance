const HEIGHTS = [45, 75, 20, 15, 85]

/** Grey placeholder bar chart shown while it loads. */
export const BarChartSkeleton = () => {
  return (
    <div
      className="w-full h-full aspect-[2/1] animate-pulse"
      aria-busy="true"
      aria-label="Loading chart"
    >
      <div className="h-4 mb-4 bg-grass-100"></div>
      <div className="h-[85%] flex items-end gap-4 px-4 border-grass-100 border-b-2 border-l-2">
        {HEIGHTS.map((height, i) => {
          return (
            <div
              key={i}
              className={`flex-1 rounded-t bg-grass-100`}
              style={{ height: `${height}%` }}
            />
          )
        })}
      </div>
    </div>
  )
}
