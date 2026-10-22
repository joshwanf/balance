import "server-only"

const secret = process.env.JWT_SECRET
if (!secret) {
  throw new Error("JWT_SECRET must be set")
}

const config = {
  environment: process.env.NODE_ENV || "development",
  jwtConfig: {
    secret,
    expiresIn: parseInt(process.env.JWT_EXPIRES_IN || "604800"),
  },
}

export default config
