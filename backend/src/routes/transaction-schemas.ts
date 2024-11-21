import { z } from "zod"
import { buildJsonSchemas } from "fastify-zod"

const createTransactionSchema = z.object({
  payee: z.string(),
  amount: z.number(),
  date: z.date(),
  receiptUrl: z.optional(z.string()),
  itemId: z.optional(z.string()),
})
export type CreateTransasctionInput = z.infer<typeof createTransactionSchema>

const createTransactionResponseSchema = z.object({
  id: z.string(),
  payee: z.string(),
  amount: z.number(),
  date: z.date(),
  receiptUrl: z.union([z.string(), z.null()]),
  itemId: z.union([z.string(), z.null()]),
  userId: z.string(),
})

const createTransactionErrorSchema = z.object({
  type: z.string(),
  message: z.string(),
})

export const { schemas: transactionSchema, $ref } = buildJsonSchemas({
  createTransactionSchema,
  createTransactionResponseSchema,
  createTransactionErrorSchema,
})
