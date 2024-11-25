import { Router } from "express"
import { uuidv7 } from "uuidv7"
import { isLoggedIn } from "../../../utils/auth"
import { pc } from "../../../utils/prismaClient"
import { ApiTypes } from "../../../types/api"
import { cleanName } from "../../../utils/helpers/cleanName"
import { checkValidCategoryName } from "./utils"

const router = Router()

import { NextFunction, Request, Response } from "express-serve-static-core"
// interface IReq extends Request {
//   body: ApiTypes.Item.CreateItemRequest
// }
type IReq = Request<{}, {}, ApiTypes.Category.CreateCategoryRequest>
type IRes = Response<ApiTypes.Category.CreateCategoryResponse>

router.post(
  "/create",
  // isLoggedIn,
  async (req: IReq, res: IRes, next: NextFunction) => {
    console.log("create item")

    /** isLoggedIn should already check for req.user, call next() for TS */
    const user = req.user
    if (!user) {
      return next()
    }

    const { name, amount } = req.body
    const validBudgetName = await checkValidCategoryName(name, user.id)

    try {
      /** insert item */
      const newRecord = await pc.category.create({
        data: {
          id: uuidv7(),
          name,
          cleanedName: validBudgetName,
          amount,
          userId: user.id,
        },
      })
      if (!newRecord) {
        throw {
          title: "Create item",
          message: "Couldn't create item",
          status: 404,
        }
      }
      // const userGroup = await pc.userGroup.findMany()
      // console.log(userGroup)

      res.status(201).send({ ...newRecord, userId: user.id })
    } catch (e) {
      throw e
    }
  }
)

export default router
