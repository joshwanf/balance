import { Router } from "express"
import { isLoggedIn } from "../../../utils/auth"
import { pc } from "../../../utils/prismaClient"
import type { ApiTypes } from "../../../types/api"

// const router = Router()

type Handler = ApiTypes.CustomRouteHandler<{}, ApiTypes.Category.ListResponse>

const route: Handler = async (req, res, next) => {
  try {
    console.log("list items")

    const user = req.user
    if (!user) {
      return next()
    }

    // const items = await pc.userGroup.findMany({ where: { userId: user.id } })
    const categories = await pc.category.findMany({
      where: { userId: user.id },
    })

    /** Serialize transactions.amount to string */
    const safeC = categories.map(t => {
      return { ...t, amount: t.amount.toString() }
    })
    res.status(200).send({ categories: safeC })
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
