import { Router } from "express"

import { isLoggedIn } from "../../../utils/auth"
import list from "./list"
import retrieve from "./retrieve"
import create from "./create"
import change from "./change"
import remove from "./remove"
import { createValidation } from "./validations"
// import loginRouter from "./list"

const router = Router()

router.post("/ping", async (req, res, next) => {
  console.log("ping /api/transaction")
  const user = req.user || "not logged in"
  res.status(200).send({ message: "pong", state: { user } })
  // return next()
})

router.use(isLoggedIn)
router.post("/list", list)
// router.use(loginRouter)
router.post("/retrieve/:id", retrieve)
// @ts-ignore
router.post("/create", createValidation, create)
router.post("/change/:id", change)
router.post("/remove/:id", remove)

export default router
