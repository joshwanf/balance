import { Router } from "express"
import { isLoggedIn } from "../../../utils/auth"
import { pc } from "../../../utils/prismaClient"
import type { ApiTypes } from "../../../types/api"
import { getNextMonth } from "../../../utils/helpers/date"
import moment from "moment"
import { getCategoriesWithTransAgg } from "../transaction/utils"

// const router = Router()
type Req = ApiTypes.Category.ListRequest
type Res = ApiTypes.Category.ListResponse
type Handler = ApiTypes.CustomRouteHandler<Req, Res>

const route: Handler = async (req, res, next) => {
  try {
    console.log("list items")

    const user = req.user
    if (!user) {
      return next()
    }

    /**
     * List Categories for one month
     * Month determined by query param startMonth
     * - Find all Categories
     * - Find related CategoryMonth that are gte: startMonth, lt: endMonth
     */
    const startMonth = req.query.startMonth || moment().format("YYYY-MM")

    const result = await pc.$transaction(async prisma => {
      const formattedCategories = await getCategoriesWithTransAgg(
        user.id,
        startMonth,
        prisma
      )
      return formattedCategories
    })

    res.status(200).send({ categories: result })
  } catch (e) {}
}

// router.post(
//   "/list",
//   // isLoggedIn
//   route,
//   async (req, res, next) => {
//     try {
//       console.log("list budgets")

//       const user = req.user
//       if (!user) {
//         return next()
//       }

//       const items = await pc.userGroup.findMany({ where: { userId: user.id } })

//       res.status(200).send({ items })
//     } catch (e) {}
//   }
// )

export default route
