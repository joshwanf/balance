import { z } from "zod"
import { apiError } from "../errors"

const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in form YYYY-MM-DD")

/** Replaces the express-validator rules on transaction/create. */
export const createSchema = z.object({
  type: z.string().min(1),
  payee: z.string().min(1, "Must have a payee"),
  amount: z.number().int("Amount must be in cents"),
  date,
  accountId: z.string().min(1),
  categoryId: z.string().nullable().optional(),
})

export const changeSchema = createSchema.partial()

export const parseBody = <T extends z.ZodTypeAny>(
  schema: T,
  body: unknown,
  title: string,
): z.infer<T> => {
  const result = schema.safeParse(body)
  if (!result.success) {
    throw apiError(400, title, "Bad request.", z.flattenError(result.error))
  }
  return result.data
}
