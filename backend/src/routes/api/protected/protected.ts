import express, { RequestHandler, Router } from "express"
import { isLoggedIn } from "../../../utils/auth"

const router = express.Router()

router.post("/", isLoggedIn, (req, res) => {
  console.log("protectedRoute")
  res.status(200).send({ message: "viewing protected", user: req.user })
})

export default router
