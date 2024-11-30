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
      // const curMonth = req.query.curMonth || moment().format("YYYY-MM")
      const { name, amount } = req.body
      const cleanedName = cleanName(name)
      const startMonth = req.query.startMonth || moment().format("YYYY-MM")

      if (!/\d{4}-\d{2}/.test(startMonth)) {
        next({
          title: "Create category",
          message: "Month must be in YYYY-MM format",
          status: 400,
        })
      }
      /** Check if userId and cleanedName exist, throw if yes */
      const existingCategory = await prisma.category.findMany({
        where: { userId: user.id, cleanedName },
      })
      if (existingCategory.length > 0) {
        next({
          title: "Create category",
          error: {
            name: "Category name already exists",
          },
          status: 400,
        })
      }

      /** create new category and connect category month */
      const createdCategory = await prisma.category.create({
        include: { CategoryMonth: true },
        data: {
          id: uuidv7(),
          userId: user.id,
          name,
          cleanedName: cleanName(name),
          CategoryMonth: {
            create: [
              { id: uuidv7(), amount, month: startMonth, userId: user.id },
            ],
          },
        },
      })

      const formattedCategory = {
        id: createdCategory.id,
        name: createdCategory.name,
        month: startMonth,
        amount: createdCategory.CategoryMonth[0].amount,
        usedAmount: 0,
      }
      return formattedCategory
    })

    res.status(200).send(result)
  } catch (e) {
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
