import { Router } from "express"

import { isLoggedIn } from "../../../utils/auth"
import list from "./list"
import add from "./add"
import remove from "./remove"
// import change from "./change"

const router = Router()

router.post("/ping", async (req, res, next) => {
  console.log("ping /api/tag")
  const user = req.user || "not logged in"
  res.status(200).send({ message: "pong", state: { user } })
})

router.use(isLoggedIn)
router.post("/list", list)
router.post("/add/:transactionId", add)
router.post("/remove/:transactionId", remove)
// router.post("/change/:id", change)

export default router
