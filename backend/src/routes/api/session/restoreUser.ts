import { RequestHandler } from "express"
import jwt from "jsonwebtoken"
import config from "../../../config"
import type { ApiTypes } from "../../../types/api"
import { pc } from "../../../utils/prismaClient"

type Req = {}
type Res = {}
type Handler = ApiTypes.CustomRouteHandler<Req, Res>
const restoreUser: Handler = (req, res, next) => {
  // console.log("restoreUser")
  const { jwtConfig } = config
  const { token } = req.cookies
  req.user = null

  return jwt.verify(
    token,
    jwtConfig.secret,
    undefined,
    async (err, jwtPayload) => {
      // if (err) {
      //   console.log("jwt error", err)
      //   next()
      // }

      if (typeof jwtPayload === "object") {
        // console.log("jwtPayload is object")
        try {
          const { id } = jwtPayload.data
          const user = await pc.user.findUnique({
            where: { id },
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              username: true,
              accounts: { select: { id: true, name: true } },
              categories: { select: { id: true, name: true } },
            },
          })
          if (user) {
            // const { hashedPassword, ...safeUser } = user
            req.user = user
            // console.log("restoreUser found user in db from token")
            // console.log("jwt found user", req.user)
            return next()
          }
        } catch (e) {
          // console.log("restore user catch")
          res.clearCookie("token")
          return next()
        }
      }

      if (!req.user) res.clearCookie("token")
      return next()
    }
  )
}

export default restoreUser
