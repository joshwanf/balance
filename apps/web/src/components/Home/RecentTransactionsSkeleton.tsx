import { RECENT_CARD_CLASS } from "./layout"

export const RecentTransactionsSkeleton = () => (
  <div
    className={`${RECENT_CARD_CLASS} animate-pulse`}
    aria-busy="true"
    aria-label="Loading"
  >
    <div className="flex items-baseline justify-between">
      <div className="h-6 w-20 rounded bg-neutral-200" />
      <div className="h-4 w-28 rounded bg-neutral-200" />
    </div>
    <ul className="divide-y">
      {Array.from({ length: 8 }, (_, i) => (
        <li key={i} className="flex items-center justify-between py-2.5">
          <div className="grid gap-1.5">
            <div className="h-5 w-32 rounded bg-neutral-200" />
            <div className="h-4 w-44 rounded bg-neutral-100" />
          </div>
          <div className="h-5 w-16 rounded bg-neutral-200" />
        </li>
      ))}
    </ul>
    <div className="h-5 w-36 rounded bg-neutral-100" />
  </div>
)
