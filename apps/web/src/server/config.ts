import "server-only"

const secret = process.env.JWT_SECRET
if (!secret) {
  throw new Error("JWT_SECRET must be set")
}

export type PlaidEnvironment = "sandbox" | "production"

/**
 * Plaid settings, or null when Plaid isn't configured. The app runs without
 * Plaid; the bank-linking UI is hidden instead.
 */
const readPlaidConfig = () => {
  const clientId = process.env.PLAID_CLIENT_ID
  const sandboxSecret = process.env.PLAID_SECRET_SANDBOX
  const tokenKey = process.env.PLAID_TOKEN_KEY
  if (!clientId || !sandboxSecret || !tokenKey) return null

  const productionSecret = process.env.PLAID_SECRET_PRODUCTION || null
  // Environment for new links made by real users; the demo user is always sandbox
  const linkEnvironment: PlaidEnvironment =
    process.env.PLAID_ENV === "production" ? "production" : "sandbox"
  if (linkEnvironment === "production" && !productionSecret) {
    throw new Error("PLAID_ENV=production needs PLAID_SECRET_PRODUCTION")
  }

  return {
    clientId,
    secrets: { sandbox: sandboxSecret, production: productionSecret },
    linkEnvironment,
    webhookUrl: process.env.PLAID_WEBHOOK_URL || null,
    tokenKey,
  }
}

const config = {
  environment: process.env.NODE_ENV || "development",
  jwtConfig: {
    secret,
    expiresIn: parseInt(process.env.JWT_EXPIRES_IN || "604800"),
  },
  plaid: readPlaidConfig(),
}

export default config
