import { Router } from "express"
import { isLoggedIn } from "../../../utils/auth"
import { pc } from "../../../utils/prismaClient"
import { ApiTypes } from "../../../types/api"

const router = Router()

import { NextFunction, Request, Response } from "express-serve-static-core"
interface IReq extends Request {}
type IRes = Response<ApiTypes.Budget.ListBudgetsResponse>

router.post(
  "/list",
  // isLoggedIn,
  async (req: IReq, res: IRes, next: NextFunction) => {
    console.log("list budgets")

    const user = req.user
    if (!user) {
      return next()
    }

    const budgets = await pc.budget.findMany({
      where: { userId: user.id },
      orderBy: [{ id: "asc" }],
    })

    res.status(200).send({ budgets })
  }
)

export default router
