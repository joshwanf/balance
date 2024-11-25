import { Router } from "express"
import { isLoggedIn } from "../../../utils/auth"
import { pc } from "../../../utils/prismaClient"
import { queryOpts } from "./utils"
import { ApiTypes } from "../../../types/api"

// const router = Router()

// import { NextFunction, Request, Response } from "express-serve-static-core"
// interface IReq extends Request {
//   body: Partial<ApiTypes.Transaction.TransactionWithItem>
// }
// type IRes = Response<ApiTypes.Transaction.RetrieveTransactionResponse>

type Req = {}
type Res = ApiTypes.Transaction.RetrieveTransactionResponse
type Handler = ApiTypes.CustomRouteHandler<Req, Res>

const route: Handler = async (req, res, next) => {
  console.log("retrieve transaction")

  /** isLoggedIn should already check for req.user, call next() for TS */
  const user = req.user
  if (!user) {
    return next()
  }

  const { id } = req.params

  const record = await pc.transaction.findUnique({
    where: { id, userId: user.id },
    // include: {
    //   Item: { select: { name: true, cleanedName: true } },
    // },
    ...queryOpts,
  })

  if (!record) {
    throw {
      title: "Retrieve transaction",
      message: "Couldn't find the transaction",
      status: 404,
    }
  }
  const safeT = {
    ...record,
    amount: record.amount.toString(),
    date: record.date.toString(),
  }
  res.status(200).send(safeT)
}

// router.post(
//   "/retrieve/:id",
//   //   isLoggedIn,
//   async (req: IReq, res: IRes, next: NextFunction) => {
//     console.log("retrieve transaction")

//     /** isLoggedIn should already check for req.user, call next() for TS */
//     const user = req.user
//     if (!user) {
//       return next()
//     }

//     const { id } = req.params

//     const record = await pc.transaction.findUnique({
//       where: { id, userId: user.id },
//       // include: {
//       //   Item: { select: { name: true, cleanedName: true } },
//       // },
//       ...queryOpts,
//     })

//     if (!record) {
//       throw {
//         title: "Retrieve transaction",
//         message: "Couldn't find the transaction",
//         status: 404,
//       }
//     }
//     res.status(200).send(record)
//   }
// )

export default route
