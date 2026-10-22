import { NextResponse } from "next/server"
import moment from "moment"
import { pc } from "@/server/prisma"
import { searchParam, withAuth } from "@/server/handler"
import { monthParam } from "@/server/queries"
import { diffMonths } from "@/server/utils/date"
import { monthlyCatAggToMap } from "@/server/utils/trend"

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
    title
  )

  const months: { start: string; end: string }[] = []
  const starting = moment(startMonth, "YYYY-MM", true)
  for (let i = 0; i < diffMonths(startMonth, endMonth); i++) {
    // moment objects are mutable: add() advances `starting`
    months.push({
      start: starting.format("YYYY-MM"),
      end: starting.add(1, "month").format("YYYY-MM"),
    })
  }

  const result = await pc.$transaction(async prisma => {
    const allCats = await prisma.category.findMany({
      where: { userId },
      select: { id: true, name: true },
    })
    const totals = await prisma.transaction.groupBy({
      by: ["type"],
      where: { userId, date: { gte: startMonth, lt: endMonth } },
      _sum: { amount: true },
    })

    const outgoingTotal = []
    const incomingTotal = []
    const outgoingByCat = []
    const incomingByCat = []
    for (const m of months) {
      const where = (type: string) => ({
        userId,
        date: { gte: m.start, lt: m.end },
        type,
      })
      outgoingTotal.push(
        await prisma.transaction.aggregate({
          _sum: { amount: true },
          where: where("outgoing"),
        })
      )
      incomingTotal.push(
        await prisma.transaction.aggregate({
          _sum: { amount: true },
          where: where("incoming"),
        })
      )
      outgoingByCat.push(
        await prisma.transaction.groupBy({
          by: ["categoryId"],
          where: where("outgoing"),
          _sum: { amount: true },
        })
      )
      incomingByCat.push(
        await prisma.transaction.groupBy({
          by: ["categoryId"],
          where: where("incoming"),
          _sum: { amount: true },
        })
      )
    }

    const normOut = monthlyCatAggToMap(outgoingByCat)
    const normIn = monthlyCatAggToMap(incomingByCat)
    const byCategory = (id: string, name: string) => ({
      id,
      name,
      outgoing: normOut.map(month => month.get(id) || 0),
      incoming: normIn.map(month => month.get(id) || 0),
    })

    return {
      summary: {
        total: {
          outgoing: totals.find(t => t.type === "outgoing")?._sum.amount || 0,
          incoming: totals.find(t => t.type === "incoming")?._sum.amount || 0,
        },
        byMonth: {
          outgoing: outgoingTotal.map(month => month._sum.amount || 0),
          incoming: incomingTotal.map(month => month._sum.amount || 0),
        },
      },
      categories: [
        byCategory("unassigned", "Unassigned"),
        ...allCats.map(cat => byCategory(cat.id, cat.name)),
      ],
    }
  })
  return NextResponse.json(result)
})
