import { Router } from "express"
import { isLoggedIn } from "../../../utils/auth"
import { pc } from "../../../utils/prismaClient"
import { ApiTypes } from "../../../types/api"
import { queryOpts } from "./utils"

// const router = Router()

// import { NextFunction, Request, Response } from "express-serve-static-core"
// interface IReq extends Request {}
// type IRes = Response<ApiTypes.Transaction.ListTransactionsResponse>

type Res = ApiTypes.Transaction.ListTransactionsResponse
type Handler = ApiTypes.CustomRouteHandler<{}, Res | any>

const route: Handler = async (req, res, next) => {
  console.log("list transactions")

  /** isLoggedIn should already check for req.user, call next() for TS */
  const user = req.user
  if (!user) {
    return next()
  }
  // res.status(200).send({ ping: "ended transaction" })
  try {
    const transactions = await pc.transaction.findMany({
      where: { userId: user.id },
      orderBy: [{ date: "desc" }, { id: "asc" }],
      // include: {
      //   Item: { select: { name: true, cleanedName: true } },
      // },
      ...queryOpts,
    })
    /** Serialize transactions.amount to string */
    const safeT = transactions.map(t => {
      return { ...t, amount: t.amount.toString(), date: t.date.toString() }
    })
    res.status(200).send({ transactions: transactions })
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
