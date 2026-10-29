import { NextResponse } from "next/server"
import { listTagsWithTransactions } from "@/server/data"
import { withAuth } from "@/server/handler"

export const runtime = "nodejs"

/** The user's tags with their transactions (old POST /tag/list). */
export const GET = withAuth(async (_request, { user }) => {
  return NextResponse.json({ tags: await listTagsWithTransactions(user.id) })
})
