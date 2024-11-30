import express from "express"

// import restoreUser from "./restoreUser"
import login from "./login"
import verify from "./verify"
import logout from "./logout"
import protectedRoute from "../protected/protected"

const router = express.Router()

router.post("/ping", async (req, res, next) => {
  console.log("ping /api/session")
  res.status(200).send({ message: "pong" })
})

// router.use(restoreUser)
router.post("/verify", verify)
router.use(login)
router.use(logout)
router.use(protectedRoute)

export default router
