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
     * Add tag
     */

    const result = await pc.$transaction(async prisma => {
      const { transactionId } = req.params
      const { tags } = req.body
      const userId = user.id

      const newTagsData = tags.map(t => ({
        id: uuidv7(),
        userId,
        name: t,
        cleanedName: cleanName(t),
      }))

      for (const tag of newTagsData) {
        const newTag = await prisma.tags.upsert({
          update: {},
          create: tag,
          where: {
            userId_cleanedName: { userId, cleanedName: tag.cleanedName },
          },
        })

        /**
         * Upsert into the join table in the loop instead of createMany in the join table
         * createMany will fail if a transactionId/tagId already exists
         * Prisma cannot upsert many records at once
         */
        const updatedTransaction = await prisma.transactionsOnTags.upsert({
          update: {},
          create: {
            tagId: newTag.id,
            transactionId,
          },
          where: { transactionId_tagId: { tagId: newTag.id, transactionId } },
        })
      }
      /** createMany transactionId/tagId combo */
      // const newTags = await prisma.tags.findMany({
      //   where: {
      //     cleanedName: { in: tagsWithCleanedNames.map(t => t.cleanedName) },
      //   },
      // })

      // const newDataForJoin = newTags.map(t => ({ transactionId, tagId: t.id }))
      // await prisma.transactionsOnTags.createMany({
      //   data: newDataForJoin,
      // })

      const updatedTransaction = await prisma.transaction.findFirstOrThrow({
        include: { tags: { include: { tags: true } } },
        where: { id: transactionId },
      })

      return updatedTransaction
    })

    // const tagIds = result.tags.map(t => t.tagId)
    const normalizedTags = result.tags.map(t => ({
      id: t.tagId,
      name: t.tags.name,
    }))
    res.status(200).send({ tags: normalizedTags })
  } catch (e) {
    console.log("error in tag/add")
    console.log(e)
  }
}

export default route
