import { uuidv7 } from "uuidv7"
import { PrismaClientValidationError } from "@prisma/client/runtime/library"
import { pc } from "../../../utils/prismaClient"
import { ApiTypes } from "../../../types/api"
import { cleanName } from "../../../utils/helpers/cleanName"

type Req = ApiTypes.Transaction.CreateRequest
type Res = ApiTypes.Transaction.CreateResponse
type Handler = ApiTypes.CustomRouteHandler<Req, Res>

const route: Handler = async (req, res, next) => {
  console.log("create transaction")
  console.log(req.body)
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
        // return newTransaction
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
        // return transWithCat
      }
      const createdTransaction = await prisma.transaction.findFirstOrThrow({
        include: { tags: { include: { tags: { select: { name: true } } } } },
        where: { id: transactionBody.id },
      })

      const { tags, ...restOfTrans } = createdTransaction
      const formattedTransaction = {
        ...restOfTrans,
        tags: tags.map(tag => tag.tags.name),
      }
      return formattedTransaction
    })

    res.status(200).send(result)
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

export default route
