import { Router } from "express"

import { isLoggedIn } from "../../../utils/auth"
import list from "./list"
import retrieve from "./retrieve"
import create from "./create"
import change from "./change"
import remove from "./remove"
import search from "./search"
import { createValidation } from "./validations"

const router = Router()

router.post("/ping", async (req, res, next) => {
  console.log("ping /api/transaction")
  const user = req.user || "not logged in"
  res.status(200).send({ message: "pong", state: { user } })
  // return next()
})

router.use(isLoggedIn)
router.post("/list", list)
router.post("/retrieve/:id", retrieve)
// @ts-ignore
router.post("/create", createValidation, create)
router.post("/change/:id", change)
router.post("/remove/:id", remove)
router.post("/search", search)

export default router
