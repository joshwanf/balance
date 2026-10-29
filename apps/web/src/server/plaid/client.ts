import "server-only"
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid"
import config, { type PlaidEnvironment } from "../config"

const clients = new Map<PlaidEnvironment, PlaidApi>()

/** Whether Plaid keys are set. When false, the bank-linking UI is hidden. */
export const isPlaidConfigured = () => config.plaid !== null

/**
 * A Plaid API client for one environment. Each PlaidItem records the
 * environment it was made in, so the demo user's sandbox items and real
 * users' production items can live in the same deployment.
 */
export const plaidClient = (environment: PlaidEnvironment): PlaidApi => {
  const cached = clients.get(environment)
  if (cached) return cached

  const plaid = config.plaid
  if (!plaid) {
    throw new Error(
      "Plaid is not configured: set PLAID_CLIENT_ID, PLAID_SECRET_SANDBOX and PLAID_TOKEN_KEY",
    )
  }
  const secret = plaid.secrets[environment]
  if (!secret) throw new Error(`No Plaid secret set for ${environment}`)

  const client = new PlaidApi(
    new Configuration({
      basePath: PlaidEnvironments[environment],
      baseOptions: {
        headers: {
          "PLAID-CLIENT-ID": plaid.clientId,
          "PLAID-SECRET": secret,
        },
      },
    }),
  )
  clients.set(environment, client)
  return client
}
