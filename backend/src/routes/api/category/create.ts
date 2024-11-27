import { uuidv7 } from "uuidv7"
import { pc } from "../../../utils/prismaClient"
import type { ApiTypes } from "../../../types/api"
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
} from "@prisma/client/runtime/library"
import { cleanName } from "../../../utils/helpers/cleanName"
import moment from "moment"
import { getCategoriesWithTransAgg } from "../transaction/utils"

type IReq = ApiTypes.Category.CreateRequest
type IRes = ApiTypes.Category.CreateResponse
type Handler = ApiTypes.CustomRouteHandler<IReq, IRes>

const route: Handler = async (req, res, next) => {
  try {
    console.log("create category")

    const user = req.user
    if (!user) {
      return next()
    }

    /**
     * Create one Category and CategoryMonth record for that month
     * Month determined by query param startMonth
     */
    const result = await pc.$transaction(async prisma => {
      const curMonth = req.query.curMonth || moment().format("YYYY-MM")
      const { name, amount } = req.body
      const createdCategory = await prisma.category.create({
        include: { CategoryMonth: true },
        data: {
          id: uuidv7(),
          userId: user.id,
          name,
          cleanedName: cleanName(name),
          CategoryMonth: {
            create: [
              { id: uuidv7(), amount, month: curMonth, userId: user.id },
            ],
          },
        },
      })

      const formattedCategory = {
        id: createdCategory.id,
        name: createdCategory.name,
        amount: createdCategory.CategoryMonth[0].amount,
        usedAmount: 0,
      }
      return formattedCategory

      // /** create category */
      // const amountAsDecimal = parseFloat(amount)
      // const created = await prisma.category.create({
      //   data: {
      //     id: uuidv7(),
      //     name,
      //     cleanedName: cleanName(name),
      //     amount: amountAsDecimal,
      //     userId: user.id,
      //   },
      // })

      // /** Add usedAmount and serialize amount field */
      // const result = {
      //   ...created,
      //   usedAmount: "0",
      //   amount: created.amount.toString(),
      // }

      // return result
    })

    res.status(200).send(result)
  } catch (e) {
    console.log(e)
    if (
      e instanceof PrismaClientKnownRequestError ||
      e instanceof PrismaClientUnknownRequestError ||
      e instanceof Error
    ) {
      throw {
        title: "Create category",
        error: e,
        status: 404,
      }
    }
    throw {
      title: "Create category",
      message: "unknown error",
      status: 404,
    }
  }
}

export default route
