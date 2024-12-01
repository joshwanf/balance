import { pc } from "../../../utils/prismaClient"
import type { ApiTypes } from "../../../types/api"
import moment from "moment"
import { getCategoriesWithTransAgg } from "../transaction/utils"
import { getAccountsWithTransAgg } from "./utils"

type Req = ApiTypes.Account.ListRequest
type Res = ApiTypes.Account.ListResponse
type Handler = ApiTypes.CustomRouteHandler<Req, Res>

const route: Handler = async (req, res, next) => {
  try {
    console.log("list accounts")

    const user = req.user
    if (!user) {
      return next()
    }

    /**
     * List Accounts
     */
    const startMonth = req.query.startMonth || moment().format("YYYY-MM")
    const nextMonth = moment(startMonth, "YYYY-MM")
      .add(1, "month")
      .format("YYYY-MM")

    const result = await pc.$transaction(async prisma => {
      const accountId = undefined // use undefined for all user accounts
      const formattedAccounts = getAccountsWithTransAgg(
        user.id,
        accountId,
        startMonth,
        prisma
      )
      return formattedAccounts
    })

    res.status(200).send({ accounts: result })
  } catch (e) {}
}

export default route
