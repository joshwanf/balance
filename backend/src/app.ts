import Fastify from "fastify"
import { FastifyRequest, FastifyReply } from "fastify"
import fastifyEnv from "@fastify/env"
import fastifyJwt from "@fastify/jwt"
import fastifyCookie from "@fastify/cookie"
import { transactionSchema } from "./routes/transaction-schemas"
import {
  signupRoute,
  loginRoute,
  logoutRoute,
  restoreSessionRoute,
} from "./routes/authRoutes"
import { transactionRoutes } from "./routes/transactions"
import { proute } from "./routes/protected"
import "dotenv/config"

const jwtSecret = process.env.JWT_SECRET || ""
console.log("secret key from .env", jwtSecret)

const app = Fastify({
  logger: true,
})

// Register the plugins
app.register(fastifyEnv, {
  confKey: "dotenv",
  schema: {
    type: "object",
    properties: {
      JWT_SECRET: { type: "string" },
      EXPIRES_IN: { type: "string" },
      PORT: { type: "string" },
    },
    required: ["JWT_SECRET", "DATABASE_URL", "PORT"],
  },
  dotenv: true,
})
app.register(fastifyCookie)
app.register(fastifyJwt, {
  secret: jwtSecret, // Replace with your secret, or use process.env.JWT_SECRET
  // cookie: {
  //   cookieName: "token", // Name of the cookie where the JWT will be stored
  //   signed: true,
  // },
})
for (let schema of [...transactionSchema]) {
  app.addSchema(schema)
}

// Register routes
app.register(signupRoute, { prefix: "/session" })
app.register(loginRoute, { prefix: "/session" })
app.register(logoutRoute, { prefix: "/session" })
app.register(restoreSessionRoute, { prefix: "/session" })
app.register(proute)
app.register(transactionRoutes, { prefix: "/transaction" })

// Start the server
const start = async () => {
  try {
    await app.listen({ port: 5000 })
    console.log("Server listening on http://localhost:5000")
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}
start()
