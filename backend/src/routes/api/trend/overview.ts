import { pc } from "../../../utils/prismaClient"
import { ApiTypes } from "../../../types/api"
import moment from "moment"

type Req = ApiTypes.Trend.OverviewRequest
type Res = ApiTypes.Trend.OverviewResponse
type Handler = ApiTypes.CustomRouteHandler<Req, Res>

const route: Handler = async (req, res, next) => {
  console.log("trend overview")

  /** isLoggedIn should already check for req.user, call next() for TS */
  const user = req.user
  if (!user) {
    return next()
  }

  try {
    /**
     * Summarize one month's transactions
     * Group by category, sum outgoing, sum incoming
     * Returns { total: { outgoing: number, incoming: number }, categories summaryObj[] }
     * where summaryObj = {id: string, name: string, outgoing: number, incoming: number}
     * 1. Transactions from all categories and sum outgoing/incoming
     * 2. Group transactions by category and sum outgoing/incoming
     */

    const startMonth = req.query.startMonth || moment().format("YYYY-MM")
    const nextMonth =
      req.query.endMonth || moment(startMonth).add(1, "month").format("YYYY-MM")

    const result = await pc.$transaction(async prisma => {
      const userId = user.id
      const allOutTrans = await prisma.transaction.aggregate({
        _sum: { amount: true },
        where: {
          userId,
          date: { gte: startMonth, lt: nextMonth },
          type: "outgoing",
        },
      })
      const allInTrans = await prisma.transaction.aggregate({
        _sum: { amount: true },
        where: {
          userId,
          date: { gte: startMonth, lt: nextMonth },
          type: "incoming",
        },
      })

      /** All categories and outgoing/incoming by category */
      const allCats = await prisma.category.findMany({
        where: { userId },
        select: { id: true, name: true },
      })
      const outgoing = await prisma.transaction.groupBy({
        by: ["categoryId"],
        where: {
          userId,
          date: { gte: startMonth, lt: nextMonth },
          type: "outgoing",
        },
        _sum: { amount: true },
      })
      const incoming = await prisma.transaction.groupBy({
        by: ["categoryId"],
        where: {
          userId,
          date: { gte: startMonth, lt: nextMonth },
          type: "incoming",
        },
        _sum: { amount: true },
      })

      const normOut = new Map(
        outgoing.map(c => {
          const id = c.categoryId || "unassigned"
          const amount = c._sum.amount ? c._sum.amount : 0
          return [id, amount]
        })
      )
      const normIn = new Map(
        incoming.map(c => {
          return [c.categoryId || "unassigned", c._sum.amount || 0]
        })
      )

      const formattedCats = allCats.map(cat => {
        return {
          id: cat.id,
          name: cat.name,
          outgoing: normOut.get(cat.id) || 0,
          incoming: normIn.get(cat.id) || 0,
        }
      })

      const unassigned = {
        id: "unassigned",
        name: "Unassigned",
        outgoing: normOut.get("unassigned") || 0,
        incoming: normIn.get("unassigned") || 0,
      }
      const categories = [unassigned, ...formattedCats]

      const formattedOverview = {
        total: {
          outgoing: allOutTrans._sum.amount || 0,
          incoming: allInTrans._sum.amount || 0,
        },
        categories,
      }
      return formattedOverview
    })

    res.status(200).send(result)
  } catch (e) {
    console.log("error in trend/overview")
    console.log(e)
  }
}

export default route
