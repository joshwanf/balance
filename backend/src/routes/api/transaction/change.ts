import { uuidv7 } from "uuidv7"
import { PrismaClientValidationError } from "@prisma/client/runtime/library"
import { pc } from "../../../utils/prismaClient"
import { ApiTypes } from "../../../types/api"
import { cleanName } from "../../../utils/helpers/cleanName"
import { confirmT } from "./utils"

type Req = Partial<ApiTypes.Transaction.ChangeRequest>
type Res = ApiTypes.Transaction.ChangeResponse
type Handler = ApiTypes.CustomRouteHandler<Req, Res>

const route: Handler = async (req, res, next) => {
  console.log("change transaction")
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
    const { categoryName, ...bodyInput } = req.body
    /** use Prisma transaction for the new Transaction and CategoryItem */
    const result = await pc.$transaction(async prisma => {
      const transactionBody = {
        // amount: Number(amount) || undefined,
        ...bodyInput,
      }

      const originalTransaction = await prisma.transaction.findUniqueOrThrow({
        where: { id },
      })

      const cName = req.body.categoryName
      if (categoryName) {
        console.log(
          "has categoryName",
          Boolean(categoryName),
          Boolean(categoryName?.length < 1),
          originalTransaction.categoryId
        )
      }
      if (
        typeof categoryName === "string" &&
        categoryName.length < 1 &&
        originalTransaction.categoryId
      ) {
        console.log("disconnecting category")
        /** categoryName supplied but is empty string */
        const removedCat = await prisma.transaction.update({
          include: { category: true },
          where: { id, userId: user.id },
          data: {
            category: {
              disconnect: {
                userId: user.id,
                cleanedName: cleanName(originalTransaction.categoryId),
              },
            },
          },
        })
      } else if (categoryName) {
        console.log("changing or adding category")
        /** categoryName supplied with existing or new value */
        const newOrUpdatedCat = await prisma.category.upsert({
          include: { transactions: true },
          update: {
            transactions: { connect: { id } },
          },
          create: {
            id: uuidv7(),
            userId: user.id,
            name: categoryName,
            cleanedName: cleanName(categoryName),
            transactions: { connect: { id } },
          },
          where: {
            userId_cleanedName: {
              userId: user.id,
              cleanedName: cleanName(categoryName),
            },
          },
        })
      } else {
        const updatedTransBody = await prisma.transaction.update({
          where: { id, userId: user.id },
          data: { ...transactionBody },
        })
      }
      const updatedTransaction = await prisma.transaction.findUniqueOrThrow({
        include: { tags: { include: { tags: { select: { name: true } } } } },
        where: { id },
      })

      const { tags, ...restOfTrans } = updatedTransaction
      const formattedTransaction = {
        ...restOfTrans,
        tags: tags.map(tag => tag.tags.name),
      }
      return formattedTransaction
    })
    console.log("result of updating trans", result)
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

// router.post(
//   "/edit/:id",
//   // isLoggedIn,
//   async (req: IReq, res: IRes, next: NextFunction) => {
//     console.log("edit transaction")
//     const { id } = req.params

//     /** isLoggedIn should already check for req.user, call next() for TS */
//     const user = req.user
//     if (!user) {
//       return next()
//     }

//     /** Confirm transaction exists */
//     try {
//       const isValidT = await confirmT(id, user.id)
//       if (!isValidT) {
//         throw "not a valid transaction"
//       }
//     } catch (e) {
//       return next(e)
//     }

//     /** Update with supplied fields */
//     try {
//       const { item, ...transactionBody } = req.body
//       /** use Prisma transaction for the new Transaction and CategoryItem */
//       const result = await pc.$transaction(async prisma => {
//         let itemId
//         const itemName = item?.name
//         if (itemName) {
//           /** Check if item exists */
//           const itemCleanedName = cleanName(itemName) || "(default)"
//           const item = await prisma.item.upsert({
//             create: {
//               id: uuidv7(),
//               name: itemName,
//               cleanedName: itemCleanedName,
//               UserGroup: {
//                 create: {
//                   userId: user.id,
//                 },
//               },
//             },
//             update: {},
//             where: { name: itemName },
//           })
//           console.log("found item", item)

//           /** Item already existed or was created */
//           const findGroup = await prisma.userGroup.findMany({
//             where: { userId: user.id, itemId: item.id },
//           })
//           console.log(findGroup)
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
//           console.log("group", group)
//           /** update itemId with newly created/retrieved item */
//           itemId = item.id
//         }

//         /** Update transaction */
//         const { payee, amount, date, receiptUrl } = transactionBody
//         const updatedTransaction = await prisma.transaction.update({
//           where: { id },
//           data: {
//             payee,
//             amount,
//             date,
//             receiptUrl,
//             itemId: itemId,
//           },
//           ...queryOpts,
//         })
//         console.log("updated transaction", updatedTransaction)
//         return updatedTransaction
//       })

//       res.status(200).send(result)
//     } catch (e) {
//       console.log(e)
//       if (e instanceof PrismaClientValidationError) {
//         /** 401 bad request body */
//         next({
//           type: "Validation error",
//           message: "Body validation error",
//           status: 401,
//         })
//       }
//       next({
//         type: "Unknown error",
//         message: "an unknown error occurred",
//       })
//     }
//   }
// )

export default route
