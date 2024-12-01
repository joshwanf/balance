import { uuidv7 } from "uuidv7"
import { pc } from "../../../utils/prismaClient"
import type { ApiTypes } from "../../../types/api"
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
} from "@prisma/client/runtime/library"
import { cleanName } from "../../../utils/helpers/cleanName"
import moment from "moment"
import { getAccountsWithTransAgg } from "./utils"

type Req = ApiTypes.Account.CreateRequest
type Res = ApiTypes.Account.CreateResponse
type Handler = ApiTypes.CustomRouteHandler<Req, Res>

const route: Handler = async (req, res, next) => {
  try {
    console.log("create account")

    const user = req.user
    if (!user) {
      return next()
    }

    /**
     * Create one Account and add an initial balance as a transaction
     * Transaction date determined by the day the account is created
     */
    const result = await pc.$transaction(async prisma => {
      const { name, accountType, initialBalance } = req.body
      const cleanedName = cleanName(name)
      const curDate = moment().format("YYYY-MM-DD")
      const startMonth = moment().format("YYYY-MM")

      /** Create account */
      const newAccount = await prisma.account.create({
        include: { transactions: true },
        data: {
          id: uuidv7(),
          userId: user.id,
          name,
          cleanedName,
          accountType,
          transactions: {
            create: [
              {
                id: uuidv7(),
                date: curDate,
                amount: initialBalance,
                payee: "Initial balance",
                type: "incoming",
                userId: user.id,
              },
            ],
          },
        },
      })

      const account = getAccountsWithTransAgg(
        user.id,
        newAccount.id,
        startMonth,
        prisma
      )

      return account
    })

    res.status(200).send({ accounts: result })
  } catch (e) {
    if (
      e instanceof PrismaClientKnownRequestError ||
      e instanceof PrismaClientUnknownRequestError ||
      e instanceof Error
    ) {
      throw {
        title: "Create account",
        error: e,
        status: 404,
      }
    }
    throw {
      title: "Create account",
      message: "unknown error",
      status: 404,
    }
  }
}

export default route
