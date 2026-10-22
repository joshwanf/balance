import { NextResponse } from "next/server"
import { uuidv7 } from "uuidv7"
import type { ApiTypes } from "@balance/api-types"
import { pc, TxClient } from "@/server/prisma"
import { apiError } from "@/server/errors"
import { listParam, readJson, withAuth } from "@/server/handler"
import { confirmT } from "@/server/queries"
import { cleanName } from "@/server/utils/cleanName"

export const runtime = "nodejs"

type Params = { id: string }

const transactionTags = async (transactionId: string, prisma: TxClient) => {
  const t = await prisma.transaction.findFirstOrThrow({
    include: { tags: { include: { tags: true } } },
    where: { id: transactionId },
  })
  return t.tags.map(tag => ({ id: tag.tagId, name: tag.tags.name }))
}

/** Add tags to a transaction, creating them as needed (old /tag/add). */
export const POST = withAuth<Params>(async (request, { params, user }) => {
  const transactionId = params.id
  const { tags } = await readJson<ApiTypes.Tag.AddRequest>(request)
  if (!Array.isArray(tags) || !tags.every(t => typeof t === "string")) {
    throw apiError(400, "Add tags", "Include tags: string[]")
  }
  await confirmT(transactionId, user.id)
  const userId = user.id

  const result = await pc.$transaction(async prisma => {
    for (const name of tags) {
      const cleanedName = cleanName(name)
      const tag = await prisma.tags.upsert({
        where: { userId_cleanedName: { userId, cleanedName } },
        update: {},
        create: { id: uuidv7(), userId, name, cleanedName },
      })
      // Upsert one at a time: createMany fails on an existing pair.
      await prisma.transactionsOnTags.upsert({
        where: { transactionId_tagId: { tagId: tag.id, transactionId } },
        update: {},
        create: { tagId: tag.id, transactionId },
      })
    }
    return transactionTags(transactionId, prisma)
  })
  return NextResponse.json({ tags: result })
})

/** Remove tags: DELETE /api/transactions/:id/tags?names=a,b (old /tag/remove). */
export const DELETE = withAuth<Params>(async (request, { params, user }) => {
  const transactionId = params.id
  const names = listParam(request, "names")
  if (!names.length) throw apiError(400, "Remove tags", "Include ?names=")
  await confirmT(transactionId, user.id)

  const result = await pc.$transaction(async prisma => {
    await prisma.transactionsOnTags.deleteMany({
      where: {
        transactionId,
        tags: { userId: user.id, cleanedName: { in: names.map(cleanName) } },
      },
    })
    return transactionTags(transactionId, prisma)
  })
  return NextResponse.json({ tags: result })
})
