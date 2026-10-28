import { NextResponse } from "next/server"
import moment from "moment"
import type { ApiTypes } from "@balance/api-types"
import { apiError } from "@/server/errors"
import { readJson, searchParam, withAuth } from "@/server/handler"
import { getAccountsWithTransAgg } from "@/server/queries"
import { cleanName } from "@/server/utils/cleanName"
import { createAccount } from "@/server/account"

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

  const account = await createAccount(user.id, {
    name,
    accountType,
    initialBalance: amount,
  })

  if (!account) {
    throw apiError(400, "Create account", "Couldn't create account.")
  }

  const res: ApiTypes.Account.CreateResponse = {
    account: {
      id: account.account.id,
      name,
      accountType,
      usedAmount: initialBalance || 0,
    },
  }
  return NextResponse.json(res, { status: 201 })
})
