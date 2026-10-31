interface Props {
  count?: number
}

/** Grey placeholder cards in the accounts grid layout, shown while it loads. */
export const CardGridSkeleton = ({ count = 3 }: Props) => {
  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 animate-pulse"
      aria-busy="true"
      aria-label="Loading"
    >
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="border-4 border-grass-100 rounded-lg p-4 h-32 space-y-3"
        >
          <div className="h-4 w-3/4 rounded bg-grass-100" />
          <div className="h-4 w-1/2 rounded bg-grass-100" />
          <div className="h-4 w-1/3 rounded bg-grass-100" />
        </div>
      ))}
    </div>
  )
}
