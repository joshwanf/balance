import { NextFunction, RequestHandler, Response } from "express"
import jwt from "jsonwebtoken"
import config from "../config"
import { ApiTypes } from "../types/api"

const { jwtConfig } = config
const { secret, expiresIn } = jwtConfig
const expiresNumber = parseInt(expiresIn)

// Sends a JWT Cookie
export const setTokenCookie = (
  res: Response,
  user: ApiTypes.Session.SafeUser
) => {
  // Create the token.
  const safeUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    username: user.username,
  }
  const token = jwt.sign(
    { data: safeUser },
    secret,
    { expiresIn: expiresNumber } // 604,800 seconds = 1 week
  )

  const isProduction = process.env.NODE_ENV === "production"

  // Set the token cookie
  res.cookie("token", token, {
    maxAge: expiresNumber * 1000, // maxAge in milliseconds
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction && "lax",
  })

  return token
}

export const isLoggedIn: RequestHandler = (req, res, next) => {
  console.log("isLoggedIn")
  if (req.user) return next()
  if (!req.user) {
    const err = {
      title: "User isn't logged in!",
      message: "Forbidden",
      status: 403,
    }
    console.log("isLoggedIn couldn't find user")
    return next(err)
  }
  next()
}

// const restoreUser = (req: Request, res: Response, next: NextFunction) => {
//   // token parsed from cookies
//   const { token } = req.cookies
//   req.user = null

//   return jwt.verify(token, secret, null, async (err, jwtPayload) => {
//     if (err) {
//       return next()
//     }

//     try {
//       const { id } = jwtPayload.data
//       /** prisma search for user */
//       // req.user = await User.findByPk(id, {
//       //   attributes: {
//       //     include: ["email", "createdAt", "updatedAt"],
//       //   },
//       // })
//     } catch (e) {
//       res.clearCookie("token")
//       return next()
//     }

//     if (!req.user) res.clearCookie("token")

//     return next()
//   })
// }

// // If there is no current user, return an error
// const requireAuth = function (
//   req: Request,
//   _res: Response,
//   next: NextFunction
// ) {
//   if (req.user) return next()

//   const err = new Error("Authentication required")
//   // err.title = "Authentication required"
//   // err.errors = { message: "Authentication required" }
//   // err.status = 401
//   return next(err)
// }

// module.exports = { setTokenCookie, restoreUser, requireAuth }
