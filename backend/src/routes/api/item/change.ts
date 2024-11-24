import { Router } from "express"
import { uuidv7 } from "uuidv7"
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library"
import { isLoggedIn } from "../../../utils/auth"
import { pc } from "../../../utils/prismaClient"
import { ApiTypes } from "../../../types/api"
import { cleanName } from "../../../utils/helpers/cleanName"
import { checkValidBudgetName, confirmB } from "./utils"

const router = Router()

import { NextFunction, Request, Response } from "express-serve-static-core"
interface IReq extends Request {
  body: { name: string }
}

type IRes = Response<ApiTypes.Budget.Budget>

router.post(
  "/change/:id",
  isLoggedIn,
  async (req: IReq, res: IRes, next: NextFunction) => {
    console.log("edit budget")
    const { id } = req.params

    /** isLoggedIn should already check for req.user, call next() for TS */
    const user = req.user
    if (!user) {
      return next()
    }

    // /** Confirm budget exists */
    // try {
    //   const isValidT = await confirmB(id, user.id)
    //   if (!isValidT) {
    //     throw "not a valid transaction"
    //   }
    // } catch (e) {
    //   return next(e)
    // }

    /** Update with supplied fields */
    try {
      const { name } = req.body
      const updated = await pc.budget.update({
        where: { id, userId: user.id },
        data: { name, cleanedName: cleanName(name) },
      })

      if (!updated) {
        throw {
          title: "Update budget",
          message: "Couldn't update budget",
          status: 400,
        }
      }

      res.status(200).send(updated)
    } catch (e) {
      console.log(e)
      if (e instanceof PrismaClientValidationError) {
        /** 401 bad request body */
        throw {
          type: "Change budget",
          error: e,
          status: 401,
        }
      } else if (e instanceof PrismaClientKnownRequestError) {
        throw {
          title: "Change budget",
          error: e,
          status: 401,
        }
      }
      next({
        type: "Change budget",
        message: "an unknown error occurred",
      })
    }
  }
)

export default router
