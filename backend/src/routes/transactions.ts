import type { FastifyInstance } from "fastify"
import { Prisma } from "@prisma/client"
import { prisma } from "../../prisma/prismaClient"
import { authenticate } from "./authRoutes"

import type { API } from "../../../utils/types/api/api"
import { uuidv7 } from "uuidv7"
import { cleanName } from "../../../utils/helpers/cleanName"
import { $ref } from "./transaction-schemas"

export const transactionRoutes = async (app: FastifyInstance) => {
  app.post("/get", { onRequest: authenticate }, async (req, res) => {
    const user = req.session
    if (user) {
      const transactions = await prisma.transaction.findMany({
        where: {
          userId: user.id,
        },
      })
      res.code(200).send({ transactions })
    }
  })

  /** Create one transaction */
  app.post<{
    Body: API.Transaction.CreateTransactionRequest
    Reply: {
      200: API.Transaction.CreateTransactionResponse
      400: API.Transaction.CreateTransactionValidationError
      401: API.Transaction.CreateTransactionInvalidCredentialError
      500: API.Transaction.CreateTransactionValidationError
    }
  }>(
    "/add",
    {
      schema: {
        body: $ref("createTransactionSchema"),
        response: {
          200: $ref("createTransactionResponseSchema"),
          400: $ref("createTransactionErrorSchema"),
          401: $ref("createTransactionErrorSchema"),
          500: $ref("createTransactionErrorSchema"),
        },
      },
      attachValidation: true,
      onRequest: authenticate,
    },
    async (req, res) => {
      const user = req.session
      if (!user) {
        return res
          .code(401)
          .send({ type: "Invalid request", message: "Must be logged in" })
      }
      try {
        const { itemName, ...transactionBody } = req.body
        /** use Prisma transaction for the new Transaction and CategoryItem */
        const result = await prisma.$transaction(async (prisma) => {
          let itemId
          if (itemName) {
            // check if Item exists already
            const itemCleanedName = cleanName(itemName) || "(default)"
            const item = await prisma.item.upsert({
              create: {
                id: uuidv7(),
                name: itemName,
                cleanedName: itemCleanedName,
              },
              update: {},
              where: { cleanedName: itemCleanedName },
            })
            // Item already existed or was created
            const group = await prisma.group.upsert({
              create: { userId: user.id, itemCleanedName: item.cleanedName },
              update: {},
              where: {
                userId_itemCleanedName: {
                  userId: user.id,
                  itemCleanedName: itemCleanedName,
                },
              },
            })
            // update itemId with newly created/retrieved item
            itemId = item.id
          }

          /** insert transaction */
          const newTransaction = await prisma.transaction.create({
            data: {
              id: uuidv7(),
              userId: user.id,
              ...transactionBody,
              itemId: itemId || null,
            },
          })
          /** return from prisma.$transaction */
          return newTransaction
        })
        res.code(200).send(result)
      } catch (e) {
        console.log(e)
        if (e instanceof Prisma.PrismaClientValidationError) {
          /** 401 bad request body */
          res.code(400).send({
            type: "Validation error",
            message: "Body validation error",
          })
        }
        res.code(500).send({
          type: "Unknown error",
          message: "an unknown error occurred",
        })
      }
    }
  )

  /** Edit one transaction */
  app.post<{ Params: { transactionId: string } }>(
    "/change/:transactionId",
    { onRequest: authenticate },
    async (req, res) => {
      const { transactionId } = req.params
      const transaction = await prisma.transaction.findUnique({
        where: { id: transactionId },
      })
    }
  )
}
