import { Router } from "express"
import { uuidv7 } from "uuidv7"
import {
  PrismaClientValidationError,
  PrismaClientKnownRequestError,
} from "@prisma/client/runtime/library"
import { isLoggedIn } from "../../../utils/auth"
import { pc } from "../../../utils/prismaClient"
import { ApiTypes } from "../../../types/api"
import { cleanName } from "../../../utils/helpers/cleanName"
import { confirmC } from "./utils"

// const router = Router()

type Req = ApiTypes.Category.RemoveRequest
type Res = ApiTypes.Category.RemoveResponse
type Handler = ApiTypes.CustomRouteHandler<Req, Res>

const route: Handler = async (req, res, next) => {
  console.log("delete budget")

  /** isLoggedIn should already check for req.user, call next() for TS */
  const user = req.user
  if (!user) {
    return next()
  }

  try {
    const result = await pc.$transaction(async prisma => {
      const categoryIds = req.body.categoryIds
      const deletedCat = await prisma.category.deleteMany({
        where: { id: { in: categoryIds } },
      })
      return deletedCat
    })

    res.status(200).send({ type: "success", success: result })
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      console.log(e)
      throw {
        title: "Delete budget",
        error: e,
        status: 401,
      }
    }
    throw {
      title: "Delete budget",
      message: "an unknown error occurred",
      status: 404,
    }
  }
}

// router.post(
//   "/remove/",
//   // isLoggedIn,
//   async (req: Request, res: IRes, next: NextFunction) => {
//     console.log("delete budget")

//     /** isLoggedIn should already check for req.user, call next() for TS */
//     const user = req.user
//     if (!user) {
//       return next()
//     }

//     const { id } = req.params

//     try {
//       const result = await pc.$transaction(async prisma => {
//         const categoryIds = req.body.categoryIds
//         const deletedCat = await prisma.category.deleteMany({
//           where: { id: { in: catIds } },
//         })
//       })

//       const deleted = await pc.category.delete({
//         where: { id, userId: user.id },
//       })
//       console.log("deleted budget", deleted)
//       res.status(200).send({ type: "success", success: "Deleted budget" })
//     } catch (e) {
//       if (e instanceof PrismaClientKnownRequestError) {
//         console.log(e)
//         throw {
//           title: "Delete budget",
//           error: e,
//           status: 401,
//         }
//       }
//       throw {
//         title: "Delete budget",
//         message: "an unknown error occurred",
//         status: 404,
//       }
//     }
//   }
// )

export default route
