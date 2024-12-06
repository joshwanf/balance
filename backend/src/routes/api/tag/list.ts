import { pc } from "../../../utils/prismaClient"
import type { ApiTypes } from "../../../types/api"
import { cleanName } from "../../../utils/helpers/cleanName"
import { uuidv7 } from "uuidv7"

type Req = ApiTypes.Tag.AddRequest
type Res = ApiTypes.Tag.AddResponse
type Handler = ApiTypes.CustomRouteHandler<Req, Res>

const route: Handler = async (req, res, next) => {
  /** isLoggedIn should already check for req.user, call next() for TS */
  const user = req.user
  if (!user) {
    return next()
  }

  try {
    /**
     * List tags
     */

    const result = await pc.$transaction(async prisma => {
      const userId = user.id

      const tags = await prisma.tags.findMany({
        select: {
          transactions: {
            include: {
              transactions: {
                select: { id: true, date: true, payee: true, amount: true },
              },
            },
          },
          //   transactions: true,
          id: true,
          name: true,
        },
        where: { userId },
      })

      return tags
    })

    const normalizedTags = result.map(t => ({
      id: t.id,
      name: t.name,
      transactions: t.transactions.map(trans => trans.transactions),
    }))

    res.status(200).send({ tags: normalizedTags })
  } catch (e) {
    console.log("error in tag/add")
    console.log(e)
  }
}

export default route
