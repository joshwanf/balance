import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { pc } from "../../../utils/prismaClient"
import { ApiTypes } from "../../../types/api"

type Req = ApiTypes.Account.RemoveRequest
type Res = ApiTypes.Account.RemoveResponse
type Handler = ApiTypes.CustomRouteHandler<Req, Res>

const route: Handler = async (req, res, next) => {
  console.log("delete account")
  console.log(req.body)
  /** isLoggedIn should already check for req.user, call next() for TS */
  const user = req.user
  if (!user) {
    return next()
  }

  try {
    const result = await pc.$transaction(async prisma => {
      const { accountIds } = req.body
      const deletedAccount = await prisma.account.deleteMany({
        where: { id: { in: accountIds }, userId: user.id },
      })
      return deletedAccount
    })

    res.status(200).send({ type: "success", success: result })
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      console.log(e)
      throw {
        title: "Delete account",
        error: e,
        status: 401,
      }
    }
    throw {
      title: "Delete account",
      message: "an unknown error occurred",
      status: 404,
    }
  }
}

export default route
