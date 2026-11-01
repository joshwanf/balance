import Link from "next/link"
import dayjs from "dayjs"
import { getSessionUser } from "@/server/auth"
import { compareSpending, listRecentTransactions } from "@/server/data"
import { Money } from "@/utils/classes/Money"
import { withMonth } from "@/utils/month"
import { categoryColor } from "@/theme/categoryColors"
import {
  CategoryChip,
  UnassignedChip,
} from "@/components/Categories/CategoryChip"
import { RECENT_CARD_CLASS } from "./layout"

interface Props {
  month: string
}

const money = (cents: number) =>
  Money.fromCents(`${cents}`).format().replace(/^-/, "−")

/** Spending vs last month: ▲ in red when up, ▼ in green when down */
const SpendingChange = ({
  current,
  previous,
  partial,
  day,
  previousMonth,
}: Awaited<ReturnType<typeof compareSpending>>) => {
  if (previous === 0) return null
  const change = Math.round(((current - previous) / previous) * 100)
  const prev = dayjs(`${previousMonth}-01`)
  const period = partial
    ? `${prev.format("MMM")} 1–${Math.min(day, prev.daysInMonth())}`
    : prev.format("MMMM")
  const label = `Spending ${change >= 0 ? "up" : "down"} ${Math.abs(change)}% compared with ${period}`
  return (
    <span
      title={label}
      aria-label={label}
      className={`text-sm font-semibold ${change > 0 ? "text-danger-500" : "text-success-500"}`}
    >
      {change > 0 ? "▲" : change < 0 ? "▼" : "="} {Math.abs(change)}% spent vs{" "}
      {prev.format("MMM")}
    </span>
  )
}

/** The month's latest transactions, with spending against last month */
export const RecentTransactions = async ({ month }: Props) => {
  const user = await getSessionUser()
  if (!user) return null

  const [rows, spending] = await Promise.all([
    listRecentTransactions(user.id, month),
    compareSpending(user.id, month),
  ])
  const monthName = dayjs(`${month}-01`).format("MMMM")

  return (
    <section aria-labelledby="recent-heading" className={RECENT_CARD_CLASS}>
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="recent-heading" className="text-lg font-semibold">
          Recent
        </h2>
        <SpendingChange {...spending} />
      </div>

      {rows.length === 0 ? (
        <p className="py-6 text-center text-neutral-500">
          No transactions in {monthName}
          {spending.partial ? " yet" : ""}.
        </p>
      ) : (
        <ul className="divide-y">
          {rows.map(t => {
            const incoming = t.type === "incoming"
            return (
              <li
                key={t.id}
                className="flex items-center justify-between gap-3 py-2.5"
              >
                <div className="grid min-w-0 gap-0.5">
                  <span className="truncate font-semibold" title={t.payee}>
                    {t.payee}
                  </span>
                  <span className="flex min-w-0 items-center gap-2 text-sm text-neutral-500">
                    {t.category ? (
                      <CategoryChip
                        name={t.category.name}
                        color={categoryColor(t.category)}
                      />
                    ) : (
                      <UnassignedChip />
                    )}
                    <span className="shrink-0">
                      {dayjs(t.date).format("MMM D")}
                    </span>
                    {t.pending && <span className="shrink-0">· Pending</span>}
                  </span>
                </div>
                <span
                  className={`shrink-0 tabular-nums ${incoming ? "font-semibold text-success-500" : ""}`}
                >
                  {incoming ? "+" : ""}
                  {money(t.amount)}
                </span>
              </li>
            )
          })}
        </ul>
      )}

      <Link
        href={withMonth("/my-balance/transactions", month)}
        className="self-start rounded-md text-sm font-semibold text-brand-700 underline-offset-2 hover:underline
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
      >
        See all transactions
      </Link>
    </section>
  )
}
