// return two pie charts comparing months
/**
 * JSON rep for a pie chart
 * labels = string[] // each label corresponds to a category
 * total = total amount spent that month
 * spending = number[] // each number corresponds to the amount spent in that category
 * percent = number[] // percent of each month's (spending / total)
 * construct a `pie chart slice` object for each category
 * { name: string, spent: number | undefined, percent: number }
 * construct a `monthly pie chart slice` object
 * { month: string, slice: pieChartSliceObject }
 * construct a category object: monthlyPieChartSlice[]
 * return a categoryObject for every category
 */

type Categories = string[]
type Slice = { name: string; spent: number }
type PieChart = {
  month: string
  summary: Slice[]
}

import { pc } from "../../../utils/prismaClient"
import { ApiTypes } from "../../../types/api"
import { getNextMonth } from "../../../utils/helpers/date"
import { groupTransactionsAndSum } from "./utils"

type Req = ApiTypes.Trend.CompareRequest
type Res = ApiTypes.Trend.CompareResponse
type Handler = ApiTypes.CustomRouteHandler<Req, Res>

const route: Handler = async (req, res, next) => {
  console.log("trend compare")

  /** isLoggedIn should already check for req.user, call next() for TS */
  const user = req.user
  if (!user) {
    return next()
  }

  const result = await pc.$transaction(async prisma => {
    const { month1, month2 } = req.body
    const month1Range = { start: month1, end: getNextMonth(month1) }
    const month2Range = { start: month2, end: getNextMonth(month2) }
    console.log(month1Range, month2Range)

    const month1Transactions = await prisma.transaction.findMany({
      where: {
        userId: user.id,
        date: { gte: month1Range.start, lt: month1Range.end },
      },
      include: { category: { select: { id: true, name: true } } },
    })
    const month2Transactions = await prisma.transaction.findMany({
      where: {
        userId: user.id,
        date: { gte: month2Range.start, lt: month2Range.end },
      },
      include: { category: { select: { id: true, name: true } } },
    })

    const m1Summary = groupTransactionsAndSum(
      month1Transactions,
      "category",
      "amount"
    )
    const m2Summary = groupTransactionsAndSum(
      month2Transactions,
      "category",
      "amount"
    )
    return [
      { month: month1, summary: m1Summary },
      { month: month2, summary: m2Summary },
    ]
  })

  res.status(200).send(result)
}

export default route
