"use server"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { requireUser } from "@/server/auth"
import {
  addTransactionTags,
  changeTransaction,
  createTransaction,
  deleteTransaction,
  removeTransactionTags,
} from "@/server/data"
import { isApiErrorBody } from "@/server/errors"
import { changeSchema } from "@/server/transactions"
import { getFormData } from "@/server/utils/formData"
import { Money } from "@/utils/classes/Money"
import { validateDate } from "@/utils/helpers/date"

export type TransactionActionResult =
  | { status: "success" }
  | { status: "error"; error: string }

/**
 * Runs a transaction change for the logged-in user and re-renders
 * /my-balance, since budgets, accounts and trends all depend on
 * transactions. Expected failures (bad input, not found) come back as
 * { status: "error" } instead of throwing.
 */
const runMutation = async (
  fn: (userId: string) => Promise<unknown>,
): Promise<TransactionActionResult> => {
  const user = await requireUser()
  try {
    await fn(user.id)
  } catch (e) {
    if (isApiErrorBody(e)) return { status: "error", error: String(e.message) }
    throw e
  }
  revalidatePath("/my-balance", "layout")
  return { status: "success" }
}

type Parsed<T> = { ok: true; data: T } | { ok: false; error: string }

const parse = <T extends z.ZodType>(
  schema: T,
  input: unknown,
): Parsed<z.infer<T>> => {
  const result = schema.safeParse(input)
  if (!result.success) {
    const message = Object.values(z.flattenError(result.error).fieldErrors)
      .flat()
      .join(" ")
    return { ok: false, error: message || "Invalid transaction." }
  }
  return { ok: true, data: result.data }
}

export type CreateTransactionState =
  | { status: "idle" }
  | { status: "success" }
  | {
      status: "error"
      form: {
        date: string
        payee: string
        amount: string
        accountId: string
        categoryId: string
      }
      error: {
        date?: string
        payee?: string
        amount?: string
        account?: string
        invalid?: string
      }
    }

export const createTransactionAction = async (
  _prev: CreateTransactionState,
  formData: FormData,
): Promise<CreateTransactionState> => {
  const form = {
    date: getFormData(formData, "date").trim(),
    payee: getFormData(formData, "payee").trim(),
    amount: getFormData(formData, "amount").trim(),
    accountId: getFormData(formData, "accountId"),
    categoryId: getFormData(formData, "categoryId"),
  }

  const isValidDate = validateDate({ date: form.date, format: "YYYY-MM-DD" })
  const isValidPayee = form.payee.length > 0
  const isValidAmount = Money.isValidMoney(form.amount)
  const isValidAccount = form.accountId.length > 0

  if (!isValidDate || !isValidPayee || !isValidAmount || !isValidAccount) {
    return {
      status: "error",
      form,
      error: {
        date: isValidDate ? undefined : "Date must be YYYY-MM-DD",
        payee: isValidPayee ? undefined : "Payee must be filled out",
        amount: isValidAmount
          ? undefined
          : "Amount must be a valid dollar amount",
        account: isValidAccount ? undefined : "Select or create an account",
      },
    }
  }

  const result = await runMutation(userId =>
    createTransaction(userId, {
      type: "outgoing",
      date: form.date,
      payee: form.payee,
      amount: Money.parse(form.amount).toInt(),
      accountId: form.accountId,
      categoryId: form.categoryId || null,
    }),
  )
  return result.status === "success"
    ? result
    : { status: "error", form, error: { invalid: result.error } }
}

export const changeTransactionAction = async (
  id: string,
  changes: z.input<typeof changeSchema>,
): Promise<TransactionActionResult> => {
  const parsed = parse(changeSchema, changes)
  if (!parsed.ok) return { status: "error", error: parsed.error }
  return runMutation(userId => changeTransaction(userId, id, parsed.data))
}

export const deleteTransactionAction = async (
  id: string,
): Promise<TransactionActionResult> =>
  runMutation(userId => deleteTransaction(userId, id))

export const addTransactionTagsAction = async (
  id: string,
  tags: string[],
): Promise<TransactionActionResult> =>
  runMutation(userId => addTransactionTags(userId, id, tags))

export const removeTransactionTagsAction = async (
  id: string,
  tags: string[],
): Promise<TransactionActionResult> =>
  runMutation(userId => removeTransactionTags(userId, id, tags))
