import { NextResponse } from "next/server"
import type { ApiTypes } from "@balance/api-types"
import { apiError } from "@/server/errors"
import { listParam, readJson, withAuth } from "@/server/handler"
import { addTransactionTags, removeTransactionTags } from "@/server/data"

export const runtime = "nodejs"

type Params = { id: string }

/** Add tags to a transaction, creating them as needed (old /tag/add). */
export const POST = withAuth<Params>(async (request, { params, user }) => {
  const transactionId = params.id
  const { tags } = await readJson<ApiTypes.Tag.AddRequest>(request)
  if (!Array.isArray(tags) || !tags.every(t => typeof t === "string")) {
    throw apiError(400, "Add tags", "Include tags: string[]")
  }
  const result = await addTransactionTags(user.id, transactionId, tags)
  return NextResponse.json({ tags: result })
})

/** Remove tags: DELETE /api/transactions/:id/tags?names=a,b (old /tag/remove). */
export const DELETE = withAuth<Params>(async (request, { params, user }) => {
  const transactionId = params.id
  const names = listParam(request, "names")
  if (!names.length) throw apiError(400, "Remove tags", "Include ?names=")
  const result = await removeTransactionTags(user.id, transactionId, names)
  return NextResponse.json({ tags: result })
})
