import "server-only"
import dayjs from "dayjs"
import { pc } from "../prisma"

/** The newest transactions in a month, with the category's name and colour */
export const listRecentTransactions = async (
  userId: string,
  month: string,
  limit = 8,
) => {
  const start = dayjs(`${month}-01`)
  const rows = await pc.transaction.findMany({
    where: {
      userId,
      date: {
        gte: start.format("YYYY-MM"),
        lt: start.add(1, "month").format("YYYY-MM"),
      },
    },
    orderBy: [{ date: "desc" }, { id: "desc" }],
    take: limit,
    select: {
      id: true,
      payee: true,
      amount: true,
      type: true,
      date: true,
      pending: true,
      category: { select: { id: true, name: true, color: true } },
    },
  })
  return rows
}

const spentBetween = async (userId: string, from: string, to: string) => {
  const agg = await pc.transaction.aggregate({
    where: { userId, type: "outgoing", date: { gte: from, lte: to } },
    _sum: { amount: true },
  })
  return agg._sum.amount ?? 0
}

/**
 * Spending in a month against the month before. For the current month only
 * the days so far count on both sides (1st to today vs 1st to the same day
 * last month), so the comparison isn't against a whole month.
 */
export const compareSpending = async (
  userId: string,
  month: string,
  today = dayjs(),
) => {
  const start = dayjs(`${month}-01`)
  const prevStart = start.subtract(1, "month")
  const partial = today.format("YYYY-MM") === month
  const day = partial ? today.date() : start.daysInMonth()
  const prevDay = partial
    ? Math.min(day, prevStart.daysInMonth())
    : prevStart.daysInMonth()

  const [current, previous] = await Promise.all([
    spentBetween(
      userId,
      start.format("YYYY-MM-01"),
      start.date(day).format("YYYY-MM-DD"),
    ),
    spentBetween(
      userId,
      prevStart.format("YYYY-MM-01"),
      prevStart.date(prevDay).format("YYYY-MM-DD"),
    ),
  ])
  return {
    current,
    previous,
    partial,
    day,
    previousMonth: prevStart.format("YYYY-MM"),
  }
}
