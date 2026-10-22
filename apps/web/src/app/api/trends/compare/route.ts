import { NextResponse } from "next/server"
import { pc } from "@/server/prisma"
import { apiError } from "@/server/errors"
import { searchParam, withAuth } from "@/server/handler"
import { getNextMonth } from "@/server/utils/date"
import { groupTransactionsAndSum } from "@/server/utils/trend"

export const runtime = "nodejs"

const MONTH = /^\d{4}-\d{2}$/

/** Spending by category for two months (old POST /trend/compare). */
export const GET = withAuth(async (request, { user }) => {
  const month1 = searchParam(request, "month1")
  const month2 = searchParam(request, "month2")
  if (!month1 || !month2 || !MONTH.test(month1) || !MONTH.test(month2)) {
    throw apiError(400, "Trend compare", "Include ?month1=YYYY-MM&month2=YYYY-MM")
  }

  const summarize = async (month: string) => {
    const transactions = await pc.transaction.findMany({
      where: { userId: user.id, date: { gte: month, lt: getNextMonth(month) } },
      include: { category: { select: { id: true, name: true } } },
    })
    return { month, summary: groupTransactionsAndSum(transactions, "category", "amount") }
  }
  return NextResponse.json([await summarize(month1), await summarize(month2)])
})
