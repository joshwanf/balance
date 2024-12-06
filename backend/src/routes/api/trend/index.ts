import { Router } from "express"

import { isLoggedIn } from "../../../utils/auth"
import overview from "./overview"
import compare from "./compare"

const router = Router()

router.post("/ping", async (req, res, next) => {
  console.log("ping /api/trend")
  const user = req.user || "not logged in"
  res.status(200).send({ message: "pong", state: { user } })
  // return next()
})

router.use(isLoggedIn)
router.post("/overview", overview)
router.post("/compare", compare)

export default router
