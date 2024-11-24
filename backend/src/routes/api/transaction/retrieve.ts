import { Router } from "express"
import { isLoggedIn } from "../../../utils/auth"
import { pc } from "../../../utils/prismaClient"

const router = Router()

router.post("/retrieve/:id", isLoggedIn, async (req, res, next) => {
  console.log("retrieve transaction")

  /** isLoggedIn should already check for req.user, call next() for TS */
  const user = req.user
  if (!user) {
    return next()
  }

  const { id } = req.params

  const record = await pc.transaction.findUnique({
    where: { id, userId: user.id },
    include: {
      Item: { select: { name: true, cleanedName: true } },
    },
  })

  if (!record) {
    throw {
      title: "Retrieve transaction",
      message: "Couldn't find the transaction",
      status: 404,
    }
  }
  res.status(200).send(record)
})

export default router
