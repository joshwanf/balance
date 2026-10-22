import { NextResponse } from "next/server"
import { pc } from "@/server/prisma"
import { withAuth } from "@/server/handler"

export const runtime = "nodejs"

/** The user's tags with their transactions (old POST /tag/list). */
export const GET = withAuth(async (_request, { user }) => {
  const tags = await pc.tags.findMany({
    where: { userId: user.id },
    select: {
      id: true,
      name: true,
      transactions: {
        include: {
          transactions: {
            select: { id: true, date: true, payee: true, amount: true },
          },
        },
      },
    },
  })
  return NextResponse.json({
    tags: tags.map(t => ({
      id: t.id,
      name: t.name,
      transactions: t.transactions.map(trans => trans.transactions),
    })),
  })
})
