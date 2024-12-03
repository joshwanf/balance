import { pc } from "../../../utils/prismaClient"
import { ApiTypes } from "../../../types/api"
import moment from "moment"
import { diffMonths } from "../../../utils/helpers/date"
import { monthlyCatAggToMap } from "./utils"

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
     * Summarize N month's transactions
     * Group by category, sum outgoing, sum incoming
     * Returns { total: { outgoing: number[], incoming: number[] }, categories summaryObj[] }
     * where summaryObj = {id: string, name: string, outgoing: number[], incoming: number[]}
     * 1. Find number of months between start and end, get {start: YYYY-MM, end: YYYY-MM} for each month
     * 2. Get all categories
     * 3. Loop through months and for each month, find:
     * - all outgoing/incoming transactions (not grouping on category) -> sum
     * - all outgoing/incoming transactions grouped by category -> sum
     * 4. Since each array of arrays is grouped by month, normalize to grouped by category:
     * - `monthlyCatAggToMap` transforms {categoryId, _sum}[] to Map(categoryId, _sum.amount || null)
     * 5. Loop through categories to construct final object to be sent out:
     * - category: { categoryId, categoryName, outgoing: transactionSumByCategoryByMonth[], incoming: transactionSumByCategoryByMonth[]}
     * - total: {outgoing: transactionSumByMonth[], incoming: transactionSumByMonth[]}
     * - result: {total, categories: category[]}
     */

    const userId = user.id
    const startMonth = req.query.startMonth || moment().format("YYYY-MM")
    const endMonth =
      req.query.endMonth || moment(startMonth).add(1, "month").format("YYYY-MM")

    // 1. Find number of months
    const numMonths = diffMonths(startMonth, endMonth)
    const months: { start: string; end: string }[] = []
    const starting = moment(startMonth, "YYYY-MM", true)
    for (let i = 0; i < numMonths; i++) {
      /** Moment objects are mutable... */
      months.push({
        start: starting.format("YYYY-MM"),
        end: starting.add(1, "month").format("YYYY-MM"),
      })
    }

    const result = await pc.$transaction(async prisma => {
      // 2. Get all categories and total over this period
      const allCats = await prisma.category.findMany({
        where: { userId },
        select: { id: true, name: true },
      })
      const totals = await prisma.transaction.groupBy({
        by: ["type"],
        where: { userId, date: { gte: startMonth, lt: endMonth } },
        _sum: { amount: true },
      })

      // 3. Loop through each month and aggregate sum transactions
      const outgoingTotal = []
      const incomingTotal = []
      const outgoingByCat = []
      const incomingByCat = []
      for (const m of months) {
        const outgoingTotalByMonth = await prisma.transaction.aggregate({
          _sum: { amount: true },
          where: {
            userId,
            date: { gte: m.start, lt: m.end },
            type: "outgoing",
          },
        })
        const incomingTotalByMonth = await prisma.transaction.aggregate({
          _sum: { amount: true },
          where: {
            userId,
            date: { gte: m.start, lt: m.end },
            type: "incoming",
          },
        })
        const outgoingAggByMonth = await prisma.transaction.groupBy({
          by: ["categoryId"],
          where: {
            userId,
            date: { gte: m.start, lt: m.end },
            type: "outgoing",
          },
          _sum: { amount: true },
        })
        const incomingAggByMonth = await prisma.transaction.groupBy({
          by: ["categoryId"],
          where: {
            userId,
            date: { gte: m.start, lt: m.end },
            type: "incoming",
          },
          _sum: { amount: true },
        })
        outgoingTotal.push(outgoingTotalByMonth)
        incomingTotal.push(incomingTotalByMonth)
        outgoingByCat.push(outgoingAggByMonth)
        incomingByCat.push(incomingAggByMonth)
      }

      // 4. Normalize data from "grouped by month" -> "grouped by category"
      const normOut = monthlyCatAggToMap(outgoingByCat)
      const normIn = monthlyCatAggToMap(incomingByCat)

      // 5. Loop through categories (allCats) to construct final object
      const formattedCats = allCats.map(cat => {
        const outgoingData = normOut.map(month => month.get(cat.id) || 0)
        const incomingData = normIn.map(month => month.get(cat.id) || 0)
        return {
          id: cat.id,
          name: cat.name,
          outgoing: outgoingData,
          incoming: incomingData,
        }
      })
      // If there are unassigned transactions
      const unassigned = {
        id: "unassigned",
        name: "Unassigned",
        outgoing: normOut.map(month => month.get("unassigned") || 0),
        incoming: normIn.map(month => month.get("unassigned") || 0),
      }
      const categories = [unassigned, ...formattedCats]
      const result = {
        summary: {
          total: {
            outgoing:
              totals.filter(t => t.type === "outgoing")[0]?._sum.amount || 0,
            incoming:
              totals.filter(t => t.type === "incoming")[0]?._sum.amount || 0,
          },
          byMonth: {
            outgoing: outgoingTotal.map(month => month._sum.amount || 0),
            incoming: incomingTotal.map(month => month._sum.amount || 0),
          },
        },
        categories,
      }
      console.log(result)
      return result
      // const allOutTrans = await prisma.transaction.aggregate({
      //   _sum: { amount: true },
      //   where: {
      //     userId,
      //     date: { gte: startMonth, lt: endMonth },
      //     type: "outgoing",
      //   },
      // })
      // const allInTrans = await prisma.transaction.aggregate({
      //   _sum: { amount: true },
      //   where: {
      //     userId,
      //     date: { gte: startMonth, lt: endMonth },
      //     type: "incoming",
      //   },
      // })

      // /** All categories and outgoing/incoming by category */
      // const allCats = await prisma.category.findMany({
      //   where: { userId },
      //   select: { id: true, name: true },
      // })
      // const outgoing = await prisma.transaction.groupBy({
      //   by: ["categoryId"],
      //   where: {
      //     userId,
      //     date: { gte: startMonth, lt: endMonth },
      //     type: "outgoing",
      //   },
      //   _sum: { amount: true },
      // })
      // const incoming = await prisma.transaction.groupBy({
      //   by: ["categoryId"],
      //   where: {
      //     userId,
      //     date: { gte: startMonth, lt: endMonth },
      //     type: "incoming",
      //   },
      //   _sum: { amount: true },
      // })

      // const normOut = new Map(
      //   outgoing.map(c => {
      //     const id = c.categoryId || "unassigned"
      //     const amount = c._sum.amount ? c._sum.amount : 0
      //     return [id, amount]
      //   })
      // )
      // const normIn = new Map(
      //   incoming.map(c => {
      //     return [c.categoryId || "unassigned", c._sum.amount || 0]
      //   })
      // )

      // const formattedCats = allCats.map(cat => {
      //   return {
      //     id: cat.id,
      //     name: cat.name,
      //     outgoing: normOut.get(cat.id) || 0,
      //     incoming: normIn.get(cat.id) || 0,
      //   }
      // })

      // const unassigned = {
      //   id: "unassigned",
      //   name: "Unassigned",
      //   outgoing: normOut.get("unassigned") || 0,
      //   incoming: normIn.get("unassigned") || 0,
      // }
      // const categories = [unassigned, ...formattedCats]

      // const formattedOverview = {
      //   total: {
      //     outgoing: allOutTrans._sum.amount || 0,
      //     incoming: allInTrans._sum.amount || 0,
      //   },
      //   categories,
      // }
      // return formattedOverview
    })

    res.status(200).send(result)
  } catch (e) {
    console.log("error in trend/overview")
    console.log(e)
  }
}

export default route
