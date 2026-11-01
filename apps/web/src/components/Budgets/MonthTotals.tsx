import { getSessionUser } from "@/server/auth"
import { monthTotals } from "@/server/data"
import { Money } from "@/utils/classes/Money"

export const TOTALS_GRID_CLASS = "grid grid-cols-2 gap-2 sm:flex sm:gap-3"
export const TOTAL_TILE_CLASS =
  "grid rounded-xl bg-neutral-100 px-3 py-2 sm:min-w-44"

const Tile = ({ label, cents }: { label: string; cents: number }) => (
  <div className={TOTAL_TILE_CLASS}>
    <span className="text-xs text-neutral-600">{label}</span>
    <span className="text-lg font-semibold">
      {Money.fromCents(cents.toString()).format()}
    </span>
  </div>
)

/** The month's spending and income, above the budgets table */
export const MonthTotals = async ({ month }: { month: string }) => {
  const user = await getSessionUser()
  if (!user) return null
  const { spent, broughtIn } = await monthTotals(user.id, month)
  return (
    <div className={TOTALS_GRID_CLASS}>
      <Tile label="Spent" cents={spent} />
      <Tile label="Brought in" cents={broughtIn} />
    </div>
  )
}

export const MonthTotalsSkeleton = () => (
  <div className={`${TOTALS_GRID_CLASS} animate-pulse`} aria-hidden="true">
    {["Spent", "Brought in"].map(label => (
      <div key={label} className={TOTAL_TILE_CLASS}>
        <span className="text-xs text-neutral-600">{label}</span>
        <span className="my-1.5 h-4 w-24 rounded bg-neutral-200" />
      </div>
    ))}
  </div>
)
