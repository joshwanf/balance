import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { authenticate } from "./authRoutes"

export const proute = async function (app: FastifyInstance) {
  // Define a protected route that requires both JWT and Admin verification
  app.post(
    "/protected",
    {
      onRequest: authenticate, // Use the authenticate function to verify JWT before proceeding
    },
    async function (request, reply) {
      // console.log(request)
      const user = request.user
      if (!user) {
        return reply
          .status(401)
          .send({ message: "Unauthorized: No user found" })
      }

      return reply.send({ message: "This is a protected route", user })
    }
  )
}
