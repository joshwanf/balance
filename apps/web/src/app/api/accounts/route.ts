import { NextResponse } from "next/server"
import moment from "moment"
import { uuidv7 } from "uuidv7"
import type { ApiTypes } from "@balance/api-types"
import { pc } from "@/server/prisma"
import { apiError } from "@/server/errors"
import { readJson, searchParam, withAuth } from "@/server/handler"
import { getAccountsWithTransAgg } from "@/server/queries"
import { cleanName } from "@/server/utils/cleanName"

export const runtime = "nodejs"

/** List accounts (old POST /account/list). */
export const GET = withAuth(async (request, { user }) => {
  const startMonth =
    searchParam(request, "startMonth") || moment().format("YYYY-MM")
  const accounts = await getAccountsWithTransAgg(user.id, undefined, startMonth)
  const res: ApiTypes.Account.ListResponse = { accounts }
  return NextResponse.json(res)
})

/**
 * Create one Account and add an initial balance as a transaction dated
 * the day the account is created (old POST /account/create).
 */
export const POST = withAuth(async (request, { user }) => {
  const { name, accountType, initialBalance } =
    await readJson<ApiTypes.Account.CreateRequest>(request)
  if (!name || !accountType) {
    throw apiError(400, "Create account", "Include a name and account type")
  }
  const amount = Number(initialBalance ?? 0)
  if (!Number.isInteger(amount)) {
    throw apiError(400, "Create account", "Initial balance must be in cents")
  }

  const accounts = await pc.$transaction(async prisma => {
    const newAccount = await prisma.account.create({
      data: {
        id: uuidv7(),
        userId: user.id,
        name,
        cleanedName: cleanName(name),
        accountType,
        transactions: {
          create: [
            {
              id: uuidv7(),
              date: moment().format("YYYY-MM-DD"),
              amount,
              payee: "Initial balance",
              type: "incoming",
              userId: user.id,
            },
          ],
        },
      },
    })
    return getAccountsWithTransAgg(
      user.id,
      newAccount.id,
      moment().format("YYYY-MM"),
      prisma
    )
  })

  const res: ApiTypes.Account.CreateResponse = { accounts }
  return NextResponse.json(res, { status: 201 })
})
