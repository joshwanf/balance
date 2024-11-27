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
import { confirmC } from "./utils"

const router = Router()

import { NextFunction, Request, Response } from "express-serve-static-core"

interface IDeleteBody {
  type: string
  success: string
}
type IRes = Response<IDeleteBody>

router.post(
  "/remove/:id",
  isLoggedIn,
  async (req: Request, res: IRes, next: NextFunction) => {
    console.log("delete budget")

    /** isLoggedIn should already check for req.user, call next() for TS */
    const user = req.user
    if (!user) {
      return next()
    }

    const { id } = req.params

    // /** Confirm budget exists */
    // try {
    //   const isValid = await confirmB(id, user.id)
    //   if (!isValid) {
    //     throw "not a valid budget"
    //   }
    // } catch (e) {
    //   return next(e)
    // }

    try {
      const deleted = await pc.category.delete({
        where: { id, userId: user.id },
      })
      console.log("deleted budget", deleted)
      res.status(200).send({ type: "success", success: "Deleted budget" })
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        console.log(e)
        throw {
          title: "Delete budget",
          error: e,
          status: 401,
        }
      }
      throw {
        title: "Delete budget",
        message: "an unknown error occurred",
        status: 404,
      }
    }
  }
)

export default router
