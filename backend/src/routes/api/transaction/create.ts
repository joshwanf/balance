import { uuidv7 } from "uuidv7"
import { PrismaClientValidationError } from "@prisma/client/runtime/library"
import { pc } from "../../../utils/prismaClient"
import { ApiTypes } from "../../../types/api"
import { cleanName } from "../../../utils/helpers/cleanName"
import { queryOpts } from "./utils"
import { Prisma } from "@prisma/client"

// const router = Router()

type Req = ApiTypes.Transaction.CreateRequest
type Res = ApiTypes.Transaction.CreateResponse
type Handler = ApiTypes.CustomRouteHandler<Req, Res>

const route: Handler = async (req, res, next) => {
  console.log("create transaction")

  /** isLoggedIn should already check for req.user, call next() for TS */
  const user = req.user
  if (!user) {
    return next()
  }

  try {
    /**
     * Create transaction query
     * - upsert new category name if supplied
     * - insert new transaction as part of the relationship
     */
    const { categoryName, ...bodyInput } = req.body

    /** use Prisma transaction for the new Transaction and CategoryItem */
    const result = await pc.$transaction(async prisma => {
      const transactionBody = {
        id: uuidv7(),
        userId: user.id,
        ...bodyInput,
      }
      const newTransaction = await prisma.transaction.create({
        data: { ...transactionBody },
      })

      if (!categoryName) {
        return newTransaction
      } else {
        const newOrUpdatedCat = await prisma.category.upsert({
          include: { transactions: true },
          update: { transactions: { connect: { id: newTransaction.id } } },
          create: {
            id: uuidv7(),
            userId: user.id,
            name: categoryName,
            cleanedName: cleanName(categoryName),
            transactions: { connect: { id: newTransaction.id } },
          },
          where: {
            userId_cleanedName: {
              userId: user.id,
              cleanedName: cleanName(categoryName),
            },
          },
        })
        const transWithCat = newOrUpdatedCat.transactions.filter(
          t => t.id === newTransaction.id
        )[0]
        return transWithCat
      }

      // let categoryId
      // if (categoryName) {
      //   // check if Category exists already
      //   const itemCleanedName = cleanName(categoryName) || "(default)"
      //   const item = await prisma.category.upsert({
      //     create: {
      //       id: uuidv7(),
      //       name: itemName,
      //       cleanedName: itemCleanedName,
      //       amount: transactionBody.amount,
      //       userId: user.id,
      //     },
      //     update: {},
      //     where: {
      //       userId_cleanedName: {
      //         userId: user.id,
      //         cleanedName: itemCleanedName,
      //       },
      //     },
      //   })
      //   itemId = item.id
      // }

      // /** insert transaction */
      // const newTransaction2 = await prisma.transaction.create({
      //   data: {
      //     id: uuidv7(),
      //     userId: user.id,
      //     ...transactionBody,
      //     categoryId: itemId || null,
      //   },
      //   ...queryOpts,
      // })
      // /** sum transaction.amount where categoryId exists */
      // const tAgg = await prisma.transaction.groupBy({
      //   by: ["categoryId"],
      //   _sum: { amount: true },
      //   where: { userId: user.id, NOT: { categoryId: null } },
      // })
      // /** Add sum to categories object and serialize amount field */
      // const sum = tAgg.filter(
      //   sum => sum.categoryId === newTransaction.categoryId
      // )
      // const usedAmount =
      //   sum.length === 1 ? sum[0]._sum.amount?.toString() || "0" : "0"
      // const tCat = newTransaction.category
      // const serializedCat = tCat
      //   ? {
      //       ...tCat,
      //       amount: newTransaction.category?.amount.toString() || "0",
      //       usedAmount,
      //     }
      //   : null

      // console.log("updated transaction", newTransaction)
      // const safeT = {
      //   ...newTransaction,
      //   amount: newTransaction.amount.toString(),
      //   date: newTransaction.date.toString(),
      //   category: serializedCat,
      // }
      // /** return from prisma.$transaction */
      // return safeT
    })

    res.status(200).send(result)
    // return next()
  } catch (e) {
    console.log("error from create transaction", e)
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
    } else if (e instanceof Error) {
      throw {
        title: "Create transaction",
        message: e.message,
        status: 400,
      }
    }
    next({
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

// router.post(
//   "/create",
//   // isLoggedIn,
//   async (req: IReq, res: IRes, next: NextFunction) => {
//     console.log("create transaction")

//     /** isLoggedIn should already check for req.user, call next() for TS */
//     const user = req.user
//     if (!user) {
//       return next()
//     }

//     try {
//       const { itemName, ...transactionBody } = req.body

//       /** use Prisma transaction for the new Transaction and CategoryItem */
//       const result = await pc.$transaction(async prisma => {
//         let itemId
//         if (itemName) {
//           // check if Item exists already
//           const itemCleanedName = cleanName(itemName) || "(default)"
//           const item = await prisma.item.upsert({
//             create: {
//               id: uuidv7(),
//               name: itemName,
//               cleanedName: itemCleanedName,
//             },
//             update: {},
//             where: { cleanedName: itemCleanedName },
//           })
//           // Item already existed or was created
//           const group = await prisma.userGroup.upsert({
//             create: { userId: user.id, itemId: item.id },
//             update: {},
//             where: {
//               userId_itemId: {
//                 userId: user.id,
//                 itemId: item.id,
//               },
//             },
//           })
//           // update itemId with newly created/retrieved item
//           itemId = item.id
//         }

//         /** insert transaction */
//         const newTransaction = await prisma.transaction.create({
//           data: {
//             id: uuidv7(),
//             userId: user.id,
//             ...transactionBody,
//             itemId: itemId || null,
//           },
//           ...queryOpts,
//         })
//         /** return from prisma.$transaction */
//         return newTransaction
//       })
//       res.status(200).send(result)
//       return next()
//     } catch (e) {
//       console.log(e)
//       if (e instanceof PrismaClientValidationError) {
//         /** 401 bad request body */
//         next({
//           title: "Validation error",
//           message: "body validation error",
//           status: 400,
//         })
//         //   res.status(400).send({
//         //     type: "Validation error",
//         //     message: "Body validation error",
//         //   })
//       }
//       return next({
//         title: "Validation error",
//         message: "body validation error",
//         status: 400,
//       })
//       // res.status(500).send({
//       //   type: "Unknown error",
//       //   message: "an unknown error occurred",
//       // })
//     }
//   }
// )

export default route
