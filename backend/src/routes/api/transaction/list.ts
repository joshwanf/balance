import { Router } from "express"
import { isLoggedIn } from "../../../utils/auth"
import { pc } from "../../../utils/prismaClient"

const router = Router()

router.post("/list", isLoggedIn, async (req, res, next) => {
  console.log("list transactions")

  /** isLoggedIn should already check for req.user, call next() for TS */
  const user = req.user
  if (!user) {
    return next()
  }

  const transactions = await pc.transaction.findMany({
    where: { userId: user.id },
    orderBy: [{ date: "desc" }, { id: "asc" }],
    include: {
      Item: { select: { name: true, cleanedName: true } },
    },
  })

  res.status(200).send({ transactions })
})

export default router
