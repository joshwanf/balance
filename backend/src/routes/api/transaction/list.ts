import { Router } from "express"
import { isLoggedIn } from "../../../utils/auth"
import { pc } from "../../../utils/prismaClient"
import { ApiTypes } from "../../../types/api"
import { getCategoriesWithTransAgg, queryOpts } from "./utils"
import moment from "moment"
import { getNextMonth } from "../../../utils/helpers/date"
import { categories } from "../../../../prisma/seeders/categories"

// const router = Router()

// import { NextFunction, Request, Response } from "express-serve-static-core"
// interface IReq extends Request {}
// type IRes = Response<ApiTypes.Transaction.ListTransactionsResponse>

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
        where: {
          userId: user.id,
          AND: { date: { lt: nextMonth, gte: startMonth } },
        },
        orderBy: [{ date: "desc" }, { id: "desc" }],
      })

      const formattedCategories = await getCategoriesWithTransAgg(
        user.id,
        startMonth,
        prisma
      )

      return { transactions: trans, categories: formattedCategories }
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

// router.post(
//   "/list",
//   // isLoggedIn,
//   async (req: IReq, res: IRes, next: NextFunction) => {
//     console.log("list transactions")

//     /** isLoggedIn should already check for req.user, call next() for TS */
//     const user = req.user
//     if (!user) {
//       return next()
//     }
//     // res.status(200).send({ ping: "ended transaction" })
//     // const transactions = await pc.transaction.findMany({
//     //   where: { userId: user.id },
//     //   orderBy: [{ date: "desc" }, { id: "asc" }],
//     //   // include: {
//     //   //   Item: { select: { name: true, cleanedName: true } },
//     //   // },
//     //   ...queryOpts,
//     // })
//     // /** Serialize transactions.amount to string */
//     // const safeT = transactions.map(t => {
//     //   return { ...t, amount: t.amount.toString(), date: t.date.toString() }
//     // })
//     // console.log("found t", safeT.length)
//     // res.status(200).send({ transactions: transactions })
//     // @ts-ignore
//     res.send("ok")
//   }
// )

export default route
