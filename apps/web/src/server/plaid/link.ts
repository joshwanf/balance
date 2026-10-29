import "server-only"
import { AccountSubtype, CountryCode, type AccountBase } from "plaid"
import type { PlaidEnvironment } from "../config"
import { createItemWithAccounts, type LinkedAccount } from "../data/plaid"
import { plaidClient } from "./client"
import { encryptToken } from "./crypto"

/** The Plaid accounts Balance tracks; anything else (loans, CDs, IRAs) is skipped. */
export const toLinkedAccounts = (accounts: AccountBase[]): LinkedAccount[] =>
  accounts.flatMap(a => {
    const accountType =
      a.subtype === AccountSubtype.Checking
        ? "checking"
        : a.subtype === AccountSubtype.Savings
          ? "savings"
          : a.subtype === AccountSubtype.CreditCard
            ? "credit"
            : null
    if (!accountType) return []
    return [
      {
        plaidAccountId: a.account_id,
        name: a.official_name || a.name,
        accountType,
        mask: a.mask,
      },
    ]
  })

/**
 * Exchanges a public_token from Link (or the sandbox) for an access token
 * and stores the item with its checking, savings and credit card accounts.
 */
export const storeLinkedItem = async (input: {
  userId: string
  publicToken: string
  environment: PlaidEnvironment
}) => {
  const client = plaidClient(input.environment)
  const { data: exchange } = await client.itemPublicTokenExchange({
    public_token: input.publicToken,
  })
  const { data: accounts } = await client.accountsGet({
    access_token: exchange.access_token,
  })
  const institutionId = accounts.item.institution_id ?? null
  const institutionName = institutionId
    ? await client
        .institutionsGetById({
          institution_id: institutionId,
          country_codes: [CountryCode.Us],
        })
        .then(r => r.data.institution.name)
        .catch(() => null)
    : null

  return createItemWithAccounts({
    userId: input.userId,
    plaidItemId: exchange.item_id,
    accessToken: encryptToken(exchange.access_token),
    environment: input.environment,
    institutionId,
    institutionName,
    accounts: toLinkedAccounts(accounts.accounts),
  })
}
