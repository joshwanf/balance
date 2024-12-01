import { uuidv7 } from "uuidv7"
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library"
import { pc } from "../../../utils/prismaClient"
import { ApiTypes } from "../../../types/api"
import { cleanName } from "../../../utils/helpers/cleanName"
import moment, { months } from "moment"
import { getAccountsWithTransAgg } from "./utils"

type Req = Partial<ApiTypes.Account.ChangeRequest>
type Res = ApiTypes.Account.ChangeResponse
type Handler = ApiTypes.CustomRouteHandler<Req, Res>

const route: Handler = async (req, res, next) => {
  console.log("change account")
  const { id } = req.params

  /** isLoggedIn should already check for req.user, call next() for TS */
  const user = req.user
  if (!user) {
    return next()
  }

  /** Update with supplied fields */
  try {
    /**
     * Change Account
     */

    const result = await pc.$transaction(async prisma => {
      const { name, accountType } = req.body
      // const startMonth = req.query.startMonth || moment().format("YYYY-MM")
      // const nextMonth = moment(startMonth, "YYYY-MM")
      //   .add(1, "month")
      //   .format("YYYY-MM")

      if (name) {
        const cleanedName = cleanName(name)
        const changedName = await prisma.account.update({
          where: { id, userId: user.id },
          data: { name, cleanedName },
        })
      }

      if (accountType) {
        const changedType = await prisma.account.update({
          where: { id, userId: user.id },
          data: { accountType },
        })
      }

      const changedAccount = await prisma.account.findUniqueOrThrow({
        where: { id, userId: user.id },
        select: { id: true, name: true, accountType: true },
      })
      return changedAccount
    })

    res.status(200).send(result)
  } catch (e) {
    console.log(e)
    if (e instanceof PrismaClientValidationError) {
      /** 401 bad request body */
      throw {
        type: "Change account",
        error: e,
        status: 401,
      }
    } else if (e instanceof PrismaClientKnownRequestError) {
      throw {
        title: "Change account",
        error: e,
        status: 401,
      }
    }
    next({
      type: "Change account",
      message: "an unknown error occurred",
    })
  }
}

export default route
