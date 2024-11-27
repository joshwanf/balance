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

// const router = Router()

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
     * Retrieve Category for one month
     * Month determined by query param startMonth
     * - Find one
     * - Find related CategoryMonth that are gte: startMonth, lt: endMonth
     */
    const startMonth = req.query.startMonth || moment().format("YYYY-MM")
    const curMonth = moment(startMonth).format("YYYY-MM")
    const nextMonth = moment(curMonth).add(1, "month").format("YYYY-MM")

    const { name, amount } = req.body

    const result = await pc.$transaction(async prisma => {
      if (name) {
        const changedCategory = await prisma.category.update({
          where: { id, userId: user.id },
          data: { name, cleanedName: cleanName(name) },
        })
      }
      if (amount && Number.isInteger(Number(amount))) {
        const changedCatMonth = await prisma.categoryMonth.upsert({
          where: {
            userId_categoryId_month: {
              userId: user.id,
              categoryId: id,
              month: curMonth,
            },
          },
          update: { amount: Number(amount) },
          create: {
            id: uuidv7(),
            userId: user.id,
            categoryId: id,
            amount: Number(amount),
            month: curMonth,
          },
        })
      }
      const aggTrans = await prisma.transaction.groupBy({
        by: ["categoryId"],
        where: {
          userId: user.id,
          categoryId: id,
          AND: { date: { lt: nextMonth, gte: curMonth } },
        },
        _sum: { amount: true },
      })

      const cat = await prisma.categoryMonth.findFirstOrThrow({
        where: { userId: user.id, categoryId: id, month: curMonth },
        select: { amount: true, month: true, category: true },
      })

      const formattedCategory = {
        id: cat.category.id,
        name: cat.category.name,
        month: cat.month,
        amount: cat.amount,
        usedAmount: aggTrans[0]._sum.amount || 0,
      }

      return formattedCategory

      // /** confirm category exists */
      // const exists = await prisma.category.findUnique({
      //   where: { id, userId: user.id },
      // })
      // if (!exists) {
      //   throw {
      //     title: "Change category",
      //     message: "Category doesnt exist",
      //     status: 404,
      //   }
      // }

      // const cleanedName = cleanName(name || exists.cleanedName)

      // /** update category */
      // const updated = await pc.category.update({
      //   where: { id, userId: user.id },
      //   data: { name, cleanedName, amount },
      // })
      // /** sum transaction.amount where categoryId exists */
      // const tAgg = await pc.transaction.groupBy({
      //   by: ["categoryId"],
      //   _sum: { amount: true },
      //   where: { userId: user.id, categoryId: id },
      // })
      // /** Add sum to categories object and serialize amount field */

      // const sum = tAgg.filter(sum => sum.categoryId === id)
      // const usedAmount =
      //   sum.length === 1 ? sum[0]._sum.amount?.toString() || "0" : "0"
      // const result = {
      //   ...updated,
      //   usedAmount,
      //   amount: updated.amount.toString(),
      // }
      // return result
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
