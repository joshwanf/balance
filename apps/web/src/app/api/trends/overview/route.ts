import { NextResponse } from "next/server"
import moment from "moment"
import { searchParam, withAuth } from "@/server/handler"
import { monthParam } from "@/server/queries"
import { trendOverview } from "@/server/data/trends"

export const runtime = "nodejs"

/**
 * Summarize transactions month by month between ?startMonth= and
 * ?endMonth= (exclusive), in total and per category (old /trend/overview).
 */
export const GET = withAuth(async (request, { user }) => {
  const userId = user.id
  const title = "Trend overview"
  const startMonth = monthParam(searchParam(request, "startMonth"), title)
  const endMonth = monthParam(
    searchParam(request, "endMonth") ||
      moment(startMonth, "YYYY-MM").add(1, "month").format("YYYY-MM"),
    title,
  )

  return NextResponse.json(await trendOverview(userId, startMonth, endMonth))
})
