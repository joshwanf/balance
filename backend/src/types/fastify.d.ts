// import fastifyJwt, {
//   FastifyJwtNamespace,
//   VerifyPayloadType,
//   JWT,
// } from "@fastify/jwt"
// import { JwtPayload } from "jsonwebtoken"
import { FastifyInstance } from "fastify"
import { VerifyPayloadType, FastifyJWT } from "@fastify/jwt"
// adding jwt property to req
// authenticate property to FastifyInstance

declare module "fastify" {
  interface FastifyInstance
    extends FastifyJwtNamespace<{ namespace: "security" }> {
    jwtDecode: "securityJwtDecode"
    jwtSign: "securityJwtSign"
    jwtVerify: "securityJwtVerify"
  }
}

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>

    /** @fastify/env dotenv variables */
    dotenv: {
      JWT_SECRET: string
      EXPIRES_IN: string
      PORT?: string
    }
  }
  interface FastifyRequest {
    user: {
      id: string
      username: string
      email: string
    } | null
    session: {
      id: string
      username: string
      email: string
    } | null
  }
  interface FastifyJWT {
    username: string
    email: string
  }
}
declare module "fastifyJwt" {
  interface VerifyPayloadType {
    username: string
    email: string
  }
}
// declare module "jsonwebtoken" {
//   interface JwtPayload {
//     id: string
//     username: string
//     email: string
//   }
// }
