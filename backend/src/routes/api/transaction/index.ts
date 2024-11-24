import { Router } from "express"

import list from "./list"
import retrieve from "./retrieve"
import create from "./create"
import edit from "./change"
import remove from "./remove"

const router = Router()

router.post("/ping", async (req, res, next) => {
  console.log("ping /api/transaction")
  const user = req.user || "not logged in"
  res.status(200).send({ message: "pong", state: { user } })
})

router.use(list)
router.use(retrieve)
router.use(create)
router.use(edit)
router.use(remove)

export default router
