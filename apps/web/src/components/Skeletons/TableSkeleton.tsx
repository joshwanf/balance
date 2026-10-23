interface Props {
  rows?: number
  cols?: number
}

/** Grey placeholder rows, sized like a data table, shown while it loads. */
export const TableSkeleton = ({ rows = 10, cols = 5 }: Props) => {
  return (
    <div className="w-full animate-pulse" aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }, (_, r) => (
        <div
          key={r}
          className="flex items-center space-x-4 border-b-2 py-3 pl-2"
        >
          <div className="h-4 w-4 rounded bg-grass-100" />
          {Array.from({ length: cols }, (_, c) => (
            <div key={c} className="h-4 flex-1 rounded bg-grass-100" />
          ))}
        </div>
      ))}
    </div>
  )
}
