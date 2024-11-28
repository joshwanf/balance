import express, { Locals, Request, Response } from "express"
import jwt from "jsonwebtoken"

import config from "../../../config"
import { ApiTypes } from "types/api"
import { pc } from "../../../utils/prismaClient"

const router = express.Router()

interface IRestoreBody {
  status: "success"
  success: {
    user: ApiTypes.Session.SafeUser | null
  }
}
type IRes = Response<IRestoreBody, Locals>

type Req = {}
type Res = {}
type Handler = ApiTypes.CustomRouteHandler<Req, Res>

const route: Handler = async (req, res, next) => {
  console.log("verifyRoute")
  const { token } = req.cookies
  const { jwtConfig } = config
  req.user = null

  try {
    const decoded = jwt.verify(token, jwtConfig.secret)
    if (typeof decoded === "object") {
      // console.log("verify route decoded", decoded)
      const { id } = decoded.data
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

      // Update verify token response to include accounts and categories
      // const user = await pc.user.findUnique({
      //   where: { id },
      //   select: {
      //     id: true,
      //     firstName: true,
      //     lastName: true,
      //     email: true,
      //     username: true,
      //     accounts: { select: { id: true, name: true } },
      //     CategoryMonth: {
      //       select: { id: true, month: true, amount: true, category: true },
      //     },
      //     // categories: { select: { id: true, name: true } },
      //   },
      // })
      if (!user) {
        console.log("verify route didnt find user in db", user)
        res.status(200).send({
          status: "success",
          success: {
            user: null,
          },
        })
        // next()
      }

      if (user) {
        // const { hashedPassword, ...safeUser } = user
        // console.log("verify route found user", safeUser)
        res.status(200).send({
          status: "success",
          success: {
            user,
          },
        })
        // next()
      }
    }
  } catch (e) {
    /** Invalid jwt so assume user is not logged in */
    res.send({ status: "success", success: { user: req.user } })
  }
}

// router.post("/verify", async (req, res, next) => {
//   console.log("verifyRoute")
//   const { token } = req.cookies
//   const { jwtConfig } = config
//   req.user = null

//   try {
//     const decoded = jwt.verify(token, jwtConfig.secret)
//     if (typeof decoded === "object") {
//       // console.log("verify route decoded", decoded)
//       const { id } = decoded.data
//       const user = await pc.user.findUnique({
//         where: { id },
//         select: {
//           id: true,
//           firstName: true,
//           lastName: true,
//           email: true,
//           username: true,
//           accounts: { select: { id: true, name: true } },
//           CategoryMonth: {
//             select: { id: true, month: true, amount: true, category: true },
//           },
//           // categories: { select: { id: true, name: true } },
//         },
//       })
//       if (!user) {
//         console.log("verify route didnt find user in db", user)
//         res.status(200).send({
//           status: "success",
//           success: {
//             user: null,
//           },
//         })
//         // next()
//       }

//       if (user) {
//         // const { hashedPassword, ...safeUser } = user
//         // console.log("verify route found user", safeUser)
//         res.status(200).send({
//           status: "success",
//           success: {
//             user,
//           },
//         })
//         // next()
//       }
//     }
//   } catch (e) {
//     /** Invalid jwt so assume user is not logged in */
//     res.send({ status: "success", success: { user: req.user } })
//   }
// })

export default route
