import { Router } from "express"
import { uuidv7 } from "uuidv7"
import { PrismaClientValidationError } from "@prisma/client/runtime/library"
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

type IRes = Response<ApiTypes.Transaction.Transaction>

router.post(
  "/edit/:id",
  isLoggedIn,
  async (req: IReq, res: IRes, next: NextFunction) => {
    console.log("edit transaction")
    const { id } = req.params

    /** isLoggedIn should already check for req.user, call next() for TS */
    const user = req.user
    if (!user) {
      return next()
    }

    /** Confirm transaction exists */
    try {
      const isValidT = await confirmT(id, user.id)
      if (!isValidT) {
        throw "not a valid transaction"
      }
    } catch (e) {
      return next(e)
    }

    /** Update with supplied fields */
    try {
      const { item, ...transactionBody } = req.body
      /** use Prisma transaction for the new Transaction and CategoryItem */
      const result = await pc.$transaction(async (prisma) => {
        let itemId
        const itemName = item?.name
        if (itemName) {
          /** Check if item exists */
          const itemCleanedName = cleanName(itemName) || "(default)"
          const item = await prisma.item.upsert({
            create: {
              id: uuidv7(),
              name: itemName,
              cleanedName: itemCleanedName,
              UserGroup: {
                create: {
                  userId: user.id,
                },
              },
            },
            update: {},
            where: { name: itemName },
          })
          console.log("found item", item)

          /** Item already existed or was created */
          const findGroup = await prisma.userGroup.findMany({
            where: { userId: user.id, itemId: item.id },
          })
          console.log(findGroup)
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
          console.log("group", group)
          /** update itemId with newly created/retrieved item */
          itemId = item.id
        }

        /** Update transaction */
        const { payee, amount, date, receiptUrl } = transactionBody
        const updatedTransaction = await prisma.transaction.update({
          where: { id },
          data: {
            payee,
            amount,
            date,
            receiptUrl,
            itemId: itemId,
          },
          include: {
            Item: {
              select: { name: true, cleanedName: true },
            },
          },
        })
        console.log("updated transaction", updatedTransaction)
        return updatedTransaction
      })

      res.status(200).send(result)
    } catch (e) {
      console.log(e)
      if (e instanceof PrismaClientValidationError) {
        /** 401 bad request body */
        next({
          type: "Validation error",
          message: "Body validation error",
          status: 401,
        })
      }
      next({
        type: "Unknown error",
        message: "an unknown error occurred",
      })
    }
  }
)

export default router
