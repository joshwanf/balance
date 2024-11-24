import { RequestHandler } from "express"
import jwt from "jsonwebtoken"
import config from "../../../config"
import type { ApiTypes } from "../../../types/api"
import { pc } from "../../../utils/prismaClient"

declare module "express-serve-static-core" {
  interface Request {
    user: ApiTypes.Session.SafeUser | null
  }
}

const restoreUser: RequestHandler = (req, res, next) => {
  console.log("restoreUser")
  const { jwtConfig } = config
  const { token } = req.cookies
  req.user = null

  return jwt.verify(
    token,
    jwtConfig.secret,
    undefined,
    async (err, jwtPayload) => {
      if (err) {
        console.log("jwt error")
        return next()
      }

      if (typeof jwtPayload === "object") {
        try {
          const { id } = jwtPayload.data
          const user = await pc.user.findUnique({ where: { id } })
          if (user) {
            const { hashedPassword, ...safeUser } = user
            req.user = safeUser
            console.log("jwt found user", req.user)
          }
          return next()
        } catch (e) {
          console.log("restore user catch")
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
