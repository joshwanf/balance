import { pc } from "../../../utils/prismaClient"
import { ApiTypes } from "../../../types/api"
import { getCategoriesWithTransAgg } from "./utils"
import moment from "moment"

type Req = ApiTypes.Transaction.ListRequest
type Res = ApiTypes.Transaction.ListResponse
type Handler = ApiTypes.CustomRouteHandler<Req, Res>

const route: Handler = async (req, res, next) => {
  // console.log("list transactions")

  /** isLoggedIn should already check for req.user, call next() for TS */
  const user = req.user
  if (!user) {
    return next()
  }

  try {
    /**
     * List transactions query
     * - get all user transactions by current month
     * - get aggregate sum of user's transactions grouped by categoryMonth
     */
    const startMonth = req.query.startMonth || moment().format("YYYY-MM")
    const nextMonth =
      req.query.endMonth || moment(startMonth).add(1, "month").format("YYYY-MM")

    const result = await pc.$transaction(async prisma => {
      const trans = await prisma.transaction.findMany({
        include: { tags: { include: { tags: { select: { name: true } } } } },
        where: {
          userId: user.id,
          AND: { date: { lt: nextMonth, gte: startMonth } },
        },
        orderBy: [{ date: "desc" }, { id: "desc" }],
      })

      const allTags = await prisma.tags.findMany({
        where: { userId: user.id },
      })

      const formattedTransactions = trans.map(t => {
        const { tags, ...restOfTrans } = t
        return {
          ...restOfTrans,
          tags: tags.map(tag => tag.tags.name),
        }
      })
      const formattedCategories = await getCategoriesWithTransAgg(
        user.id,
        startMonth,
        prisma
      )

      const formattedTags = allTags.map(t => t.name)

      return {
        transactions: formattedTransactions,
        categories: formattedCategories,
        tags: formattedTags,
      }
    })

    // const transactions = await pc.transaction.findMany({
    //   where: { userId: user.id },
    //   orderBy: [{ date: "desc" }, { id: "asc" }],
    //   ...queryOpts,
    // })
    // /** Serialize transactions.amount to string */
    // const safeT = transactions.map(t => {
    //   const { category } = t
    //   const safeCategory = category
    //     ? { ...category, amount: category.amount.toString(), usedAmount: "0" }
    //     : null
    //   return {
    //     ...t,
    //     amount: t.amount.toString(),
    //     date: t.date.toString(),
    //     category: safeCategory,
    //   }
    // })

    // const categories = await pc.category.findMany({
    //   where: { userId: user.id },
    //   select: { id: true, name: true },
    // })
    res.status(200).send(result)
  } catch (e) {
    console.log("error in transaction/list")
    console.log(e)
  }
}

export default route
