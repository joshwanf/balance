import { PrismaClient, Prisma } from "@prisma/client"
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { prisma } from "../../prisma/prismaClient"
import fp from "fastify-plugin"
import jwt from "jsonwebtoken" // If you want to manually generate JWT (optional)
import { uuidv7 } from "uuidv7"
import type { API } from "../../../utils/types/api/api"
// import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"

const jwtSecret = process.env.JWT_SECRET || ""

export const authenticate = async function (
  request: FastifyRequest,
  reply: FastifyReply
) {
  console.log("in authenticate")
  try {
    // const { token } = request.cookies
    // console.log({ token })
    // if (!token) {
    //   throw "No token!"
    // }
    // const decoded = jwt.verify(token, jwtSecret)
    // request.user = decoded
    const decoded = await request.jwtVerify()
    console.log(decoded)
    const session = decoded as FastifyRequest["session"]
    request.session = session
    console.log("found session", request.session)
    // // Verify the JWT from the cookie
  } catch (err) {
    console.log(err)
    reply.status(401).send({ message: "Unauthorized: Invalid token" })
  }
}

// export const authenticate = async (app: FastifyInstance) => {
//   app.decorate(
//     "authenticate",
//     async function (request: FastifyRequest, reply: FastifyReply) {
//       console.log("in authenticate")
//       try {
//         const decoded = await request.jwtVerify() // This decodes and verifies the token
//         console.log({ decoded })
//         request.user = decoded
//       } catch (err) {
//         reply
//           .status(401)
//           .send({ message: "Unauthorized: Invalid or expired token" })
//       }
//     }
//   )
// }
// Sign up route
export const signupRoute = async (app: FastifyInstance) => {
  app.post<{
    Body: API.User.CreateUserRequest
    Reply: {
      200: API.User.CreateUserResponse
      400: API.User.CreateUserUniqueConstraintError
    }
  }>("/signup", async (request, reply) => {
    const { firstName, lastName, username, email, hashedPassword } =
      request.body
    try {
      const user = await prisma.user.create({
        data: {
          id: uuidv7(),
          ...request.body,
        },
      })
      // Generate JWT token
      const safeUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      }
      const token = jwt.sign(safeUser, app.dotenv.JWT_SECRET, {
        expiresIn: "1h",
      })
      console.log("generated token is", token)
      request.user = safeUser

      // Set JWT token in the cookie
      reply
        .setCookie("token", token, {
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // For production environment, use https
          sameSite: "strict",
        })
        .send({ message: "User created successfully", token })
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        const meta = e.meta || {}
        if (e.code === "P2002" && "target" in meta) {
          /** A field already exists in the db */
          const badFields = (meta.target || [""]) as string[]
          reply.code(400).send({
            type: "Invalid request",
            message: `The ${badFields.join(", ")} already exists`,
          })
        }
      }
    }
  })
}

// Log in route
export const loginRoute = async (app: FastifyInstance) => {
  app.post<{ Body: { credential: string; password: string } }>(
    "/login",
    async (request, reply) => {
      const { credential, password } = request.body
      const user = await prisma.user.findFirst({
        where: {
          AND: {
            OR: [{ username: credential }, { email: credential }],
            hashedPassword: password,
          },
        },
      })
      if (!user) {
        return reply.status(401).send({ message: "Invalid credentials" })
      }
      // const user = users.get(username)
      // if (!user || user.password !== password) {
      //   return reply.status(401).send({ message: "Invalid credentials" })
      // }
      const safeUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      }
      // Generate JWT token
      const token = app.jwt.sign(safeUser, { expiresIn: "1h" })
      // const token = jwt.sign(safeUser, app.dotenv.JWT_SECRET, {
      //   expiresIn: "1h",
      // })
      console.log("generated token is", token)
      request.user = safeUser
      request.session = safeUser
      // Set JWT token in the cookie
      reply
        // .setCookie("token", token, {
        //   path: "/",
        //   httpOnly: true,
        //   secure: process.env.NODE_ENV === "production",
        //   sameSite: "strict",
        // })
        .send({ message: "Login successful", token })
    }
  )
}

// Log out route (Clear cookie)
export const logoutRoute = async (app: FastifyInstance) => {
  app.post("/logout", async (request, reply) => {
    // Clear the JWT cookie
    request.session = null
    reply
      // .clearCookie("token", { path: "/" })
      .send({ message: "Logged out successfully" })
  })
}

// Restore session route (validate the JWT token and restore user)
export const restoreSessionRoute = async (app: FastifyInstance) => {
  app.post(
    "/restore",
    {
      // preHandler: app.authenticate, // Use the authenticate function to verify JWT before proceeding
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      console.log("restoring session")
      try {
        // Try to verify the JWT stored in cookies
        // switch from fastify-jwt to regular jwt
        console.log("Attempting to verify JWT")
        console.log("secret is", app.dotenv.JWT_SECRET)
        const decoded = await request.jwtVerify() // This will decode the token and populate request.user
        const session = decoded as FastifyRequest["session"]
        if (session) {
          console.log("verified jwt")
          request.user = session
          request.session = session
          return reply.send({ user: request.user })
        }
        // const { token } = request.cookies
        // if (!token) {
        //   throw "No token!"
        // }

        // const decoded = jwt.verify(token, app.dotenv.JWT_SECRET)
        // request.user = decoded
        // console.log("Token verified:", request.user) // Log the decoded user

        // If JWT is valid, send the user's info
      } catch (err) {
        // If JWT is invalid or missing, return Unauthorized status
        console.log(err)
        return reply
          .status(401)
          .send({ type: "Unauthorized", message: "Invalid or missing token" })
      }
    }
  )
}
