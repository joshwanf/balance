import { Router } from "express"
import { uuidv7 } from "uuidv7"
import { PrismaClientValidationError } from "@prisma/client/runtime/library"
import { isLoggedIn } from "../../../utils/auth"
import { pc } from "../../../utils/prismaClient"
import { ApiTypes } from "../../../types/api"
import { cleanName } from "../../../utils/helpers/cleanName"

const router = Router()

import { NextFunction, Request, Response } from "express-serve-static-core"
interface ILoginBody extends ApiTypes.Transaction.CreateTransactionRequest {}
interface IReq extends Request {
  body: ApiTypes.Transaction.CreateTransactionRequest
}

interface ILoginRes {
  type: string
  success: { user: ApiTypes.Session.SafeUser }
}
type IRes = Response<ApiTypes.Transaction.Transaction>

router.post(
  "/create",
  isLoggedIn,
  async (req: IReq, res: IRes, next: NextFunction) => {
    console.log("create transaction")

    /** isLoggedIn should already check for req.user, call next() for TS */
    const user = req.user
    if (!user) {
      return next()
    }

    try {
      const { itemName, ...transactionBody } = req.body

      /** use Prisma transaction for the new Transaction and CategoryItem */
      const result = await pc.$transaction(async (prisma) => {
        let itemId
        if (itemName) {
          // check if Item exists already
          const itemCleanedName = cleanName(itemName) || "(default)"
          const item = await prisma.item.upsert({
            create: {
              id: uuidv7(),
              name: itemName,
              cleanedName: itemCleanedName,
            },
            update: {},
            where: { cleanedName: itemCleanedName },
          })
          // Item already existed or was created
          const group = await prisma.userGroup.upsert({
            create: { userId: user.id, itemId: item.id },
            update: {},
            where: {
              userId_itemId: {
                userId: user.id,
                itemId: item.id,
              },
            },
          })
          // update itemId with newly created/retrieved item
          itemId = item.id
        }

        /** insert transaction */
        const newTransaction = await prisma.transaction.create({
          data: {
            id: uuidv7(),
            userId: user.id,
            ...transactionBody,
            itemId: itemId || null,
          },
        })
        /** return from prisma.$transaction */
        return newTransaction
      })
      res.status(200).send(result)
    } catch (e) {
      console.log(e)
      if (e instanceof PrismaClientValidationError) {
        /** 401 bad request body */
        next({
          title: "Validation error",
          message: "body validation error",
          status: 400,
        })
        //   res.status(400).send({
        //     type: "Validation error",
        //     message: "Body validation error",
        //   })
      }
      return next({
        title: "Validation error",
        message: "body validation error",
        status: 400,
      })
      // res.status(500).send({
      //   type: "Unknown error",
      //   message: "an unknown error occurred",
      // })
    }
  }
)

export default router
