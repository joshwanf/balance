import { pc } from "../../../utils/prismaClient"
import type { ApiTypes } from "../../../types/api"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { getCategoriesWithTransAgg } from "../transaction/utils"
import moment from "moment"

type IReq = ApiTypes.Category.RetrieveRequest
type IRes = ApiTypes.Category.RetrieveResponse
type Handler = ApiTypes.CustomRouteHandler<IReq, IRes>

const route: Handler = async (req, res, next) => {
  const { id } = req.params
  try {
    console.log("retrieve one category")

    const user = req.user
    if (!user) {
      return next()
    }

    /**
     * Retrieve Category for one month
     * Month determined by query param startMonth
     * - Find one
     * - Find related CategoryMonth that are gte: startMonth, lt: endMonth
     */
    const startMonth = req.query.startMonth || moment().format("YYYY-MM")
    const curMonth = moment(startMonth).format("YYYY-MM")
    const nextMonth = moment(curMonth).add(1, "month").format("YYYY-MM")

    const result = await pc.$transaction(async prisma => {
      const category = await prisma.category.findFirst({
        where: { id, userId: user.id },
        select: {
          id: true,
          name: true,
        },
      })
      const categoryMonth = await prisma.categoryMonth.findFirst({
        where: { categoryId: id, userId: user.id, month: curMonth },
        select: {
          amount: true,
          month: true,
        },
      })
      if (!category || !categoryMonth) {
        throw {
          title: "Retrieve category",
          error: "Could not find category",
          status: 404,
        }
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
      const aggTransNorm = new Map<string, number>()
      for (const a of aggTrans) {
        if (a.categoryId && a._sum) {
          aggTransNorm.set(a.categoryId, a._sum.amount || 0)
        }
      }

      const formattedCategory = {
        ...category,
        ...categoryMonth,
        usedAmount: aggTransNorm.get(id) || 0,
      }
      return formattedCategory

      // /** find category */
      // const c = await prisma.category.findUniqueOrThrow({
      //   where: { id, userId: user.id },
      // })
      // /** sum transaction.amount where categoryId exists */
      // const tAgg = await prisma.transaction.groupBy({
      //   by: ["categoryId"],
      //   _sum: { amount: true },
      //   where: { userId: user.id, categoryId: id },
      // })
      // /** Add sum to category object and serialize amount field */
      // const sum = tAgg.filter(sum => sum.categoryId === c.id)
      // const usedAmount =
      //   sum.length === 1 ? sum[0]._sum.amount?.toString() || "0" : "0"
      // const result = { ...c, usedAmount, amount: c.amount.toString() }

      // return result
    })

    res.status(200).send(result)
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      throw {
        title: "Retrieve category",
        message: e,
        status: 404,
      }
    }
    throw {
      title: "Retrieve category",
      message: "unknown error",
      status: 404,
    }
  }
}

export default route
