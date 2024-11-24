import express from "express"
import { NextFunction, Request, Response } from "express-serve-static-core"
import { pc } from "../../../utils/prismaClient"
import { setTokenCookie } from "../../../utils/auth"
import { ApiTypes } from "../../../types/api"

const router = express.Router()

interface ILoginBody {
  credential: string
  password: string
}
interface IReq extends Request {
  body: ILoginBody
}

interface ILoginRes {
  type: string
  success: { user: ApiTypes.Session.SafeUser }
}
type IRes = Response<ILoginRes>

/**
 * req.body expects { credential, password }
 */
router.post("/login", async (req: IReq, res: IRes, next: NextFunction) => {
  console.log("loginRoute")
  req.user = null
  res.clearCookie("token")
  const credential = req.body.credential || ""
  const password = req.body.password || ""
  console.log({ credential, password })
  const user = await pc.user.findFirst({
    where: {
      OR: [
        { AND: { username: credential, hashedPassword: password } },
        { AND: { email: credential, hashedPassword: password } },
      ],
    },
  })
  console.log("found user", user)
  if (!user) {
    return next({ title: "Login", message: "Couldn't find user", status: 404 })
  }

  const { hashedPassword, ...safeUser } = user
  req.user = safeUser
  console.log("login", req.user)
  setTokenCookie(res, safeUser)
  res.status(200).send({ type: "success", success: { user: safeUser } })
  next()
})

export default router
