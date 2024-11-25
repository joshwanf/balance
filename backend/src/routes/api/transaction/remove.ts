import { pc } from "../../../utils/prismaClient"
import { ApiTypes } from "../../../types/api"
import { confirmT } from "./utils"

// const router = Router()

// import { NextFunction, Request, Response } from "express-serve-static-core"
// interface IReq extends Request {}
// type IRes = Response<ApiTypes.Transaction.RemoveTransactionResponse>
type Req = {}
type Res = ApiTypes.Transaction.RemoveTransactionResponse
type Handler = ApiTypes.CustomRouteHandler<Req, Res>

const route: Handler = async (req, res, next) => {
  console.log("delete transaction")

  /** isLoggedIn should already check for req.user, call next() for TS */
  const user = req.user
  if (!user) {
    return next()
  }

  const { id } = req.params

  /** Confirm transaction exists */
  try {
    const isValidT = await confirmT(id, user.id)
    if (!isValidT) {
      throw "not a valid transaction"
    }
  } catch (e) {
    return next(e)
  }

  try {
    const transaction = await pc.transaction.delete({
      where: { id, AND: [{ id: id }, { userId: user.id }] },
    })
    console.log("deleted transaction", transaction)
    res.status(200).send({ type: "success", message: "Deleted transaction" })
  } catch (e) {
    // res.code(404)
    throw {
      title: "Delete transaction",
      message: "couldn't delete transaction",
      status: 404,
    }
  }
}

// router.post(
//   "/remove/:id",
//   // isLoggedIn,
//   async (req: IReq, res: IRes, next: NextFunction) => {
//     console.log("delete transaction")

//     /** isLoggedIn should already check for req.user, call next() for TS */
//     const user = req.user
//     if (!user) {
//       return next()
//     }

//     const { id } = req.params

//     /** Confirm transaction exists */
//     try {
//       const isValidT = await confirmT(id, user.id)
//       if (!isValidT) {
//         throw "not a valid transaction"
//       }
//     } catch (e) {
//       return next(e)
//     }

//     try {
//       const transaction = await pc.transaction.delete({
//         where: { id, AND: [{ id: id }, { userId: user.id }] },
//       })
//       console.log("deleted transaction", transaction)
//       res.status(200).send({ type: "success", message: "Deleted transaction" })
//     } catch (e) {
//       // res.code(404)
//       throw {
//         title: "Delete transaction",
//         message: "couldn't delete transaction",
//         status: 404,
//       }
//     }
//   }
// )

export default route
