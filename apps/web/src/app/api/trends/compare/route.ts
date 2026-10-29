import { NextResponse } from "next/server"
import { apiError } from "@/server/errors"
import { searchParam, withAuth } from "@/server/handler"
import { trendCompare } from "@/server/data"

export const runtime = "nodejs"

const MONTH = /^\d{4}-\d{2}$/

/** Spending by category for two months (old POST /trend/compare). */
export const GET = withAuth(async (request, { user }) => {
  const month1 = searchParam(request, "month1")
  const month2 = searchParam(request, "month2")
  if (!month1 || !month2 || !MONTH.test(month1) || !MONTH.test(month2)) {
    throw apiError(
      400,
      "Trend compare",
      "Include ?month1=YYYY-MM&month2=YYYY-MM",
    )
  }

  return NextResponse.json(await trendCompare(user.id, month1, month2))
})
