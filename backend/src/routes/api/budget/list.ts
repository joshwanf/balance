import { Router } from "express"
import { isLoggedIn } from "../../../utils/auth"
import { pc } from "../../../utils/prismaClient"

const router = Router()

router.post("/list", isLoggedIn, async (req, res, next) => {
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
})

export default router
