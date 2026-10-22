import { z } from "zod"
import { uuidv7 } from "uuidv7"
import type { ApiTypes } from "@balance/api-types"
import { pc, TxClient } from "./prisma"
import { apiError } from "./errors"
import { cleanName } from "./utils/cleanName"

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
  categoryName: z.string().optional(),
})

export const changeSchema = createSchema.partial()

export const parseBody = <T extends z.ZodTypeAny>(
  schema: T,
  body: unknown,
  title: string
): z.infer<T> => {
  const result = schema.safeParse(body)
  if (!result.success) {
    throw apiError(400, title, "Bad request.", z.flattenError(result.error))
  }
  return result.data
}

export const assertAccountOwned = async (
  accountId: string,
  userId: string,
  prisma: TxClient | typeof pc = pc
) => {
  const account = await prisma.account.findFirst({
    where: { id: accountId, userId },
  })
  if (!account) {
    throw apiError(400, "Transaction", "Account couldn't be found")
  }
}

/** Finds or creates the user's category by name and returns its id. */
export const upsertCategoryId = async (
  name: string,
  userId: string,
  prisma: TxClient
) => {
  const cleanedName = cleanName(name)
  const category = await prisma.category.upsert({
    where: { userId_cleanedName: { userId, cleanedName } },
    update: {},
    create: { id: uuidv7(), userId, name, cleanedName },
  })
  return category.id
}

export const tagsInclude = {
  tags: { include: { tags: { select: { name: true } } } },
} as const

type WithTags<T> = T & { tags: { tags: { name: string } }[] }

export const formatTransaction = <T extends object>({
  tags,
  ...rest
}: WithTags<T>) => ({ ...rest, tags: tags.map(t => t.tags.name) })

export const getFormattedTransaction = async (
  id: string,
  prisma: TxClient | typeof pc = pc
): Promise<ApiTypes.Transaction.TSerialized> => {
  const t = await prisma.transaction.findUniqueOrThrow({
    where: { id },
    include: tagsInclude,
  })
  return formatTransaction(t)
}
