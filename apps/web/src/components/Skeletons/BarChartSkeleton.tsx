const HEIGHTS = [45, 75, 20, 15, 85]

/** Grey placeholder bar chart; fills its parent, which sets the height. */
export const BarChartSkeleton = () => {
  return (
    <div
      className="flex h-full w-full flex-col animate-pulse"
      aria-busy="true"
      aria-label="Loading chart"
    >
      <div className="flex-1 flex items-end gap-4 px-4 border-brand-100 border-b-2 border-l-2">
        {HEIGHTS.map((height, i) => {
          return (
            <div
              key={i}
              className={`flex-1 rounded-t bg-brand-100`}
              style={{ height: `${height}%` }}
            />
          )
        })}
      </div>
      <div className="mt-4 h-4 bg-brand-100"></div>
    </div>
  )
}
