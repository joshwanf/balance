import express, { Locals, Request, Response } from "express"

import { ApiTypes } from "types/api"

const router = express.Router()

interface IBody {
  status: "success"
  success: {
    user: ApiTypes.Session.SafeUser | null
  }
}
type IRes = Response<IBody, Locals>

router.post("/logout", (req, res: IRes) => {
  console.log("logoutRoute")
  req.user = null
  res.clearCookie("token")
  res.json({ status: "success", success: { user: req.user } })
})

export default router
