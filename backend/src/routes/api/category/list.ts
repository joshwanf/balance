import { Router } from "express"
import { isLoggedIn } from "../../../utils/auth"
import { pc } from "../../../utils/prismaClient"
import type { ApiTypes } from "../../../types/api"
import { getNextMonth } from "../../../utils/helpers/date"
import moment from "moment"
import { getCategoriesWithTransAgg } from "../transaction/utils"

// const router = Router()
type IReq = {}
type IRes = ApiTypes.Category.ListResponse
type Handler = ApiTypes.CustomRouteHandler<IReq, IRes>

const route: Handler = async (req, res, next) => {
  try {
    console.log("list items")

    const user = req.user
    if (!user) {
      return next()
    }

    /**
     * List Categories for one month
     * Month determined by query param startMonth
     * - Find all Categories
     * - Find related CategoryMonth that are gte: startMonth, lt: endMonth
     */
    const startMonth = req.query.startMonth || moment().format("YYYY-MM")

    const result = await pc.$transaction(async prisma => {
      const formattedCategories = await getCategoriesWithTransAgg(
        user.id,
        startMonth,
        prisma
      )
      return formattedCategories

      // const aggTrans = await prisma.transaction.groupBy({
      //   by: ["categoryId"],
      //   where: {
      //     userId: user.id,
      //     NOT: { categoryId: null },
      //     AND: { date: { lt: nextMonth, gte: curMonth } },
      //   },
      //   _sum: { amount: true },
      // })
      // const aggTransNorm = new Map<string, number>()
      // for (const a of aggTrans) {
      //   if (a.categoryId && a._sum) {
      //     aggTransNorm.set(a.categoryId, a._sum.amount || 0)
      //   }
      // }

      // // users categories and CategoryMonth for that month
      // const cats = await prisma.category.findMany({
      //   where: { userId: user.id },
      //   include: {
      //     CategoryMonth: {
      //       where: { AND: { month: { lt: nextMonth, gte: curMonth } } },
      //     },
      //   },
      // })
      // // unpack cats and only keep id, name, CategoryMonth[0].month, CategoryMonth[0].amount
      // const unpackedCats = cats.map(cat => {
      //   // CategoryMonth could be an empty array
      //   const month = cat.CategoryMonth[0].month || curMonth
      //   const amount = cat.CategoryMonth[0].amount || 0
      //   const usedAmount = aggTransNorm.get(cat.id) || 0
      //   return {
      //     id: cat.id,
      //     name: cat.name,
      //     month,
      //     amount,
      //     usedAmount,
      //   }
      // })
      // return unpackedCats

      // /** all categories by user */
      // const categories = await prisma.category.findMany({
      //   include: {CategoryMonth: true}
      //   where: { userId: user.id },
      //   select: { id: true, name: true, CategoryMonth },
      // })
      // /** sum transaction.amount where categoryId exists */
      // const tAgg = await prisma.transaction.groupBy({
      //   by: ["categoryId"],
      //   _sum: { amount: true },
      //   where: { userId: user.id, NOT: { categoryId: null } },
      // })
      // /** Add sum to categories object and serialize amount field */
      // const result = categories.map(c => {
      //   const sum = tAgg.filter(sum => sum.categoryId === c.id)
      //   const usedAmount =
      //     sum.length === 1 ? sum[0]._sum.amount?.toString() || "0" : "0"
      //   // remove userId from response
      //   // const { userId, ...safeResult } = c
      //   return { ...c, usedAmount, amount: c.amount.toString() }
      // })
      // return result
    })

    // const categories = await pc.category.findMany({
    //   where: { userId: user.id },
    // })

    // /** Serialize transactions.amount to string */
    // const safeC = categories.map(t => {
    //   return { ...t, amount: t.amount.toString() }
    // })
    res.status(200).send({ categories: result })
  } catch (e) {}
}

// router.post(
//   "/list",
//   // isLoggedIn
//   route,
//   async (req, res, next) => {
//     try {
//       console.log("list budgets")

//       const user = req.user
//       if (!user) {
//         return next()
//       }

//       const items = await pc.userGroup.findMany({ where: { userId: user.id } })

//       res.status(200).send({ items })
//     } catch (e) {}
//   }
// )

export default route
