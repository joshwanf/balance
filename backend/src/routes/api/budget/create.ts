import { Router } from "express"
import { uuidv7 } from "uuidv7"
import { PrismaClientValidationError } from "@prisma/client/runtime/library"
import { isLoggedIn } from "../../../utils/auth"
import { pc } from "../../../utils/prismaClient"
import { ApiTypes } from "../../../types/api"
import { cleanName } from "../../../utils/helpers/cleanName"
import { checkValidBudgetName } from "./utils"

const router = Router()

import { NextFunction, Request, Response } from "express-serve-static-core"
interface IReq extends Request {
  body: ApiTypes.Budget.CreateBudgetRequest
}

type IRes = Response<ApiTypes.Budget.Budget>

router.post(
  "/create",
  isLoggedIn,
  async (req: IReq, res: IRes, next: NextFunction) => {
    console.log("create budget")

    /** isLoggedIn should already check for req.user, call next() for TS */
    const user = req.user
    if (!user) {
      return next()
    }

    const { name } = req.body
    const validBudgetName = await checkValidBudgetName(name, user.id)

    try {
      /** insert budget */
      const newB = await pc.budget.create({
        data: {
          id: uuidv7(),
          userId: user.id,
          name,
          cleanedName: validBudgetName,
        },
      })
      if (!newB) {
        throw {
          title: "Create budget",
          message: "Couldn't create budget",
          status: 404,
        }
      }

      res.status(201).send(newB)
    } catch (e) {
      throw e
    }
  }
)

export default router
