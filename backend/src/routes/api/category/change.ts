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
import { checkValidCategoryName, confirmC } from "./utils"
import moment, { months } from "moment"

type IReq = ApiTypes.Category.ChangeRequest
type IRes = ApiTypes.Category.ChangeResponse
type Handler = ApiTypes.CustomRouteHandler<IReq, IRes>

const route: Handler = async (req, res, next) => {
  console.log("change category")
  const { id } = req.params

  /** isLoggedIn should already check for req.user, call next() for TS */
  const user = req.user
  if (!user) {
    return next()
  }

  /** Update with supplied fields */
  try {
    /**
     * Change Category
     * - Find one
     * - Find CategoryMonth where categoryId and month match
     */

    const result = await pc.$transaction(async prisma => {
      const { name, amount } = req.body
      const startMonth = req.query.startMonth || moment().format("YYYY-MM")
      const nextMonth = moment(startMonth, "YYYY-MM")
        .add(1, "month")
        .format("YYYY-MM")

      if (name) {
        const cleanedName = cleanName(name)
        const changedCategory = await prisma.category.update({
          where: { id, userId: user.id },
          data: { name, cleanedName },
        })
      }

      if (amount) {
        const amountAsInt = amount
        const isAmountNumber = Number.isInteger(amountAsInt)
        const isValidMonth = /\d{4}-\d{2}/.test(startMonth)
        if (!isAmountNumber || !isValidMonth) {
          throw {
            title: "Change category",
            message: "Must provide a valid amount or month (YYYY-MM)",
            status: 400,
          }
        }

        if (isAmountNumber && isValidMonth) {
          const changedCatMonth = await prisma.categoryMonth.upsert({
            where: {
              userId_categoryId_month: {
                userId: user.id,
                categoryId: id,
                month: startMonth,
              },
            },
            update: { amount: amountAsInt },
            create: {
              id: uuidv7(),
              userId: user.id,
              categoryId: id,
              amount: amountAsInt,
              month: startMonth,
            },
          })
        }
      }

      /** Aggregate transactions of that category for the month or current month */
      const aggTrans = await prisma.transaction.groupBy({
        by: ["categoryId"],
        where: {
          userId: user.id,
          categoryId: id,
          AND: { date: { lt: nextMonth, gte: startMonth } },
        },
        _sum: { amount: true },
      })

      const cat = await prisma.categoryMonth.findFirstOrThrow({
        where: { userId: user.id, categoryId: id, month: startMonth },
        select: { amount: true, month: true, category: true },
      })

      const formatedUsedAmount =
        aggTrans.length > 0 ? aggTrans[0]._sum.amount : 0

      const formattedCategory = {
        id: cat.category.id,
        name: cat.category.name,
        month: cat.month,
        amount: cat.amount,
        usedAmount: formatedUsedAmount ?? 0,
      }

      return formattedCategory
    })

    if (!result) {
      throw {
        title: "Update category",
        message: "Couldn't update category",
        status: 400,
      }
    }

    res.status(200).send(result)
  } catch (e) {
    console.log(e)
    if (e instanceof PrismaClientValidationError) {
      /** 401 bad request body */
      throw {
        type: "Change category",
        error: e,
        status: 401,
      }
    } else if (e instanceof PrismaClientKnownRequestError) {
      throw {
        title: "Change category",
        error: e,
        status: 401,
      }
    }
    next({
      type: "Change category",
      message: "an unknown error occurred",
    })
  }
}

// router.post(
//   "/change/:id",
//   isLoggedIn,
//   async (req: IReq, res: IRes, next: NextFunction) => {
//     console.log("edit budget")
//     const { id } = req.params

//     /** isLoggedIn should already check for req.user, call next() for TS */
//     const user = req.user
//     if (!user) {
//       return next()
//     }

//     // /** Confirm budget exists */
//     // try {
//     //   const isValidT = await confirmB(id, user.id)
//     //   if (!isValidT) {
//     //     throw "not a valid transaction"
//     //   }
//     // } catch (e) {
//     //   return next(e)
//     // }

//     /** Update with supplied fields */
//     try {
//       const { name } = req.body
//       const updated = await pc.category.update({
//         where: { id, userId: user.id },
//         data: { name, cleanedName: cleanName(name) },
//       })

//       if (!updated) {
//         throw {
//           title: "Update budget",
//           message: "Couldn't update budget",
//           status: 400,
//         }
//       }

//       res.status(200).send(updated)
//     } catch (e) {
//       console.log(e)
//       if (e instanceof PrismaClientValidationError) {
//         /** 401 bad request body */
//         throw {
//           type: "Change budget",
//           error: e,
//           status: 401,
//         }
//       } else if (e instanceof PrismaClientKnownRequestError) {
//         throw {
//           title: "Change budget",
//           error: e,
//           status: 401,
//         }
//       }
//       next({
//         type: "Change budget",
//         message: "an unknown error occurred",
//       })
//     }
//   }
// )

export default route
