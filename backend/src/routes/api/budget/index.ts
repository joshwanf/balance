import { Router } from "express"

import list from "./list"
import create from "./create"
import change from "./change"
import remove from "./remove"

const router = Router()

router.post("/ping", async (req, res, next) => {
  const user = req.user || "not logged in"
  res.status(200).send({ message: "pong", state: { user } })
})

router.use(list)
router.use(create)
router.use(change)
router.use(remove)

export default router
