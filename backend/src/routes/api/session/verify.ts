import express, { Locals, Request, Response } from "express"
import jwt from "jsonwebtoken"

import config from "../../../config"
import { ApiTypes } from "types/api"

const router = express.Router()

interface IRestoreBody {
  status: "success"
  success: {
    user: ApiTypes.Session.SafeUser | null
  }
}
type IRes = Response<IRestoreBody, Locals>

router.post("/verify", (req, res: IRes) => {
  console.log("verifyRoute")
  const { token } = req.cookies
  const { jwtConfig } = config
  req.user = null

  try {
    const decoded = jwt.verify(token, jwtConfig.secret)
    if (typeof decoded === "object") {
      console.log(decoded)
      const { id, firstName, lastName, email, username } = decoded.data
      const safeUser = { id, email, firstName, lastName, username }
      res.status(200).send({
        status: "success",
        success: {
          user: safeUser,
        },
      })
    }
  } catch (e) {
    /** Invalid jwt so assume user is not logged in */
    res.send({ status: "success", success: { user: req.user } })
  }
})

export default router
