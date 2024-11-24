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
  body: ApiTypes.Item.CreateRequest
}
type IRes = Response<ApiTypes.Item.Item>

router.post(
  "/create",
  isLoggedIn,
  async (req: IReq, res: IRes, next: NextFunction) => {
    console.log("create item")

    /** isLoggedIn should already check for req.user, call next() for TS */
    const user = req.user
    if (!user) {
      return next()
    }

    const { name } = req.body
    const validBudgetName = await checkValidBudgetName(name, user.id)

    try {
      /** insert item */
      const newRecord = await pc.item.create({
        data: {
          id: uuidv7(),
          name,
          cleanedName: validBudgetName,
        },
      })
      if (!newRecord) {
        throw {
          title: "Create item",
          message: "Couldn't create item",
          status: 404,
        }
      }
      const userGroup = await pc.userGroup.findMany()
      console.log(userGroup)

      res.status(201).send({ ...newRecord, userId: user.id })
    } catch (e) {
      throw e
    }
  }
)

export default router
