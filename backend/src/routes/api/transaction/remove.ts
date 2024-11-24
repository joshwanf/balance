import { Router } from "express"
import { uuidv7 } from "uuidv7"
import {
  PrismaClientValidationError,
  PrismaClientKnownRequestError,
} from "@prisma/client/runtime/library"
import { isLoggedIn } from "../../../utils/auth"
import { pc } from "../../../utils/prismaClient"
import { ApiTypes } from "../../../types/api"
import { cleanName } from "../../../utils/helpers/cleanName"
import { confirmT } from "./utils"

const router = Router()

import { NextFunction, Request, Response } from "express-serve-static-core"
interface IReq extends Request {
  body: Partial<ApiTypes.Transaction.ChangeTransactionRequest>
}

interface IDeleteBody {
  type: string
  success: string
}
type IRes = Response<IDeleteBody>

router.post("/remove/:id", async (req, res: IRes, next) => {
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
    res.status(200).send({ type: "success", success: "Deleted transaction" })
  } catch (e) {
    // res.code(404)
    throw {
      title: "Delete transaction",
      message: "couldn't delete transaction",
      status: 404,
    }
  }
})

export default router
