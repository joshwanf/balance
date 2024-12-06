import { pc } from "../../../utils/prismaClient"
import { ApiTypes } from "../../../types/api"
import { getCategoriesWithTransAgg } from "./utils"
import moment from "moment"

type Req = Partial<ApiTypes.Transaction.SearchRequest>
type Res = ApiTypes.Transaction.SearchResponse
type Handler = ApiTypes.CustomRouteHandler<Req, Res>

const route: Handler = async (req, res, next) => {
  /** isLoggedIn should already check for req.user, call next() for TS */
  const user = req.user
  if (!user) {
    return next()
  }

  try {
    /**
     * Search transactions
     * { startDate: string, endDate: string, tags: string[], generalSearch: string[] }
     */
    const { generalSearch, startDate, endDate, tags } = req.body

    const tagQuery = tags
      ? {
          some: {
            tags: {
              name: {
                in: tags,
              },
            },
          },
        }
      : {}

    const result = await pc.$transaction(async prisma => {
      const trans = await prisma.transaction.findMany({
        include: { tags: { include: { tags: { select: { name: true } } } } },
        where: {
          tags: { ...tagQuery },
          userId: user.id,
          date: { gte: startDate, lte: endDate },
        },
        orderBy: [{ date: "desc" }, { id: "desc" }],
      })

      const fuzzySearch = (
        record: string,
        searchList: string[] | undefined
      ) => {
        if (!searchList || searchList.length === 0) {
          return true
        }
        for (const term of searchList) {
          if (record.toLowerCase().includes(term.toLowerCase())) {
            return true
          }
        }
        return false
      }
      const generateSearchFilter =
        (field: string, searchList: string[] | undefined) =>
        (records: Record<string, any>) => {
          return fuzzySearch(records[field], searchList)
        }
      const payeeFilter = generateSearchFilter("payee", generalSearch)

      const filteredTrans = trans.filter(payeeFilter)

      const formattedTransactions = filteredTrans.map(t => {
        const { tags, ...restOfTrans } = t
        return {
          ...restOfTrans,
          tags: tags.map(tag => tag.tags.name),
        }
      })

      return formattedTransactions
    })

    res.status(200).send({ transactions: result })
  } catch (e) {
    console.log("error in transaction/search")
    console.log(e)
  }
}

export default route
