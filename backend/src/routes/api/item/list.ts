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

  const items = await pc.userGroup.findMany({ where: { userId: user.id } })

  res.status(200).send({ items })
})

export default router
