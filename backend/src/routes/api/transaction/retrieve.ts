import { pc } from "../../../utils/prismaClient"
import { queryOpts } from "./utils"
import { ApiTypes } from "../../../types/api"

type Req = {}
type Res = ApiTypes.Transaction.RetrieveTransactionResponse
type Handler = ApiTypes.CustomRouteHandler<Req, Res>

const route: Handler = async (req, res, next) => {
  console.log("retrieve transaction")

  /** isLoggedIn should already check for req.user, call next() for TS */
  const user = req.user
  if (!user) {
    return next()
  }

  const { id } = req.params

  const record = await pc.$transaction(async prisma => {
    const foundTransaction = await pc.transaction.findUniqueOrThrow({
      where: { id, userId: user.id },
      ...queryOpts,
    })
    /** sum transaction.amount where categoryId exists */
    const tAgg = await prisma.transaction.groupBy({
      by: ["categoryId"],
      _sum: { amount: true },
      where: { userId: user.id, NOT: { categoryId: null } },
    })
    /** Add sum to categories object and serialize amount field */
    const sum = tAgg.filter(
      sum => sum.categoryId === foundTransaction.categoryId
    )
    const usedAmount = sum.length === 1 ? sum[0]._sum.amount || 0 : 0
    const tCat = foundTransaction?.category
    const serializedCat = tCat
      ? {
          ...tCat,
          amount: foundTransaction.category?.amount || 0,
          usedAmount,
        }
      : null

    console.log("found transaction", foundTransaction)

    const formattedTags = foundTransaction.tags.map(tag => tag.tags.name)

    const safeT = {
      ...foundTransaction,
      amount: foundTransaction.amount,
      date: foundTransaction.date,
      category: serializedCat,
      tags: formattedTags,
    }
    return safeT
  })

  if (!record) {
    throw {
      title: "Retrieve transaction",
      message: "Couldn't find the transaction",
      status: 404,
    }
  }
  // const safeT = {
  //   ...record,
  //   amount: record.amount.toString(),
  //   date: record.date.toString(),
  // }
  res.status(200).send(record)
}

// router.post(
//   "/retrieve/:id",
//   //   isLoggedIn,
//   async (req: IReq, res: IRes, next: NextFunction) => {
//     console.log("retrieve transaction")

//     /** isLoggedIn should already check for req.user, call next() for TS */
//     const user = req.user
//     if (!user) {
//       return next()
//     }

//     const { id } = req.params

//     const record = await pc.transaction.findUnique({
//       where: { id, userId: user.id },
//       // include: {
//       //   Item: { select: { name: true, cleanedName: true } },
//       // },
//       ...queryOpts,
//     })

//     if (!record) {
//       throw {
//         title: "Retrieve transaction",
//         message: "Couldn't find the transaction",
//         status: 404,
//       }
//     }
//     res.status(200).send(record)
//   }
// )

export default route
