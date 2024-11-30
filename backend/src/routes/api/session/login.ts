import express from "express"
import { NextFunction, Request, Response } from "express-serve-static-core"
import { pc } from "../../../utils/prismaClient"
import { setTokenCookie } from "../../../utils/auth"
import { ApiTypes } from "../../../types/api"
import moment from "moment"
import { getCategoriesWithTransAgg } from "../transaction/utils"

const router = express.Router()

interface ILoginBody {
  credential: string
  password: string
}
interface IReq extends Request {
  body: ILoginBody
}

type Req = ApiTypes.Session.LoginRequest
type Res = ApiTypes.Session.LoginResponse
interface ILoginRes {
  type: string
  success: { user: ApiTypes.Session.SafeUser }
}
type IRes = Response<Res>

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

  const result = await pc.$transaction(async prisma => {
    const startMonth = moment().format("YYYY-MM")
    const user = await pc.user.findFirst({
      where: {
        OR: [
          { AND: { username: credential, hashedPassword: password } },
          { AND: { email: credential, hashedPassword: password } },
        ],
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        username: true,
        accounts: { select: { id: true, name: true } },
        // categories: { select: { id: true, name: true } },
      },
    })

    if (!user) {
      return user
    }

    const formattedCategories = await getCategoriesWithTransAgg(
      user.id,
      startMonth,
      prisma
    )

    return { ...user, categories: formattedCategories }
  })

  console.log("login found user")
  if (!result) {
    return next({
      title: "Login",
      message: "Couldn't find user",
      status: 404,
    })
  }
  const { accounts, categories, ...user } = result
  req.user = user
  console.log("req.user set")
  setTokenCookie(res, user)
  res.status(200).send({ status: "success", success: { user: result } })
  // return next()
})

export default router
