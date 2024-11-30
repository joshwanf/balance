import { Router } from "express"

import { isLoggedIn } from "../../../utils/auth"
import list from "./list"
import create from "./create"
import retrieve from "./retrieve"
import change from "./change"
import remove from "./remove"

const router = Router()

router.post("/ping", async (req, res, next) => {
  const user = req.user || "not logged in"
  res.status(200).send({ message: "pong", state: { user } })
})

router.use(isLoggedIn)
router.post("/list", list)
router.post("/create", create)
router.post("/retrieve/:id", retrieve)
router.post("/change/:id", change)
router.post("/remove", remove)

export default router
