"use server"
import { createAccount, deleteAccount } from "@/server/data"
import { userMutation } from "@/server/mutation"
import { removeEmptyItems } from "@/server/plaid/link"
import { getFormData } from "@/server/utils/formData"
import { Money } from "@/utils/classes/Money"

export type CreateAccountState =
  | { status: "idle" }
  | { status: "success" }
  | {
      status: "error"
      form: { name: string; accountType: string; initialBalance: string }
      error: {
        name?: string
        initialBalance?: string
        invalid?: string
      }
    }

export type DeleteAccountState =
  | { status: "success" }
  | { status: "error"; error: string }

export const createAccountAction = async (
  _prev: CreateAccountState,
  formData: FormData,
): Promise<CreateAccountState> =>
  userMutation(async user => {
    const name = getFormData(formData, "name").trim()
    const accountType = getFormData(formData, "accountType")
    const initialBalance = getFormData(formData, "initialBalance").trim()

    const isValidName = name.length > 0
    const isValidBalance = Money.isValidMoney(initialBalance)
    const isPositiveBalance = isValidBalance
      ? Money.parse(initialBalance).isPositive()
      : false
    const isBalanceFittableInDb = isPositiveBalance
      ? Money.parse(initialBalance).lte(Money.parse("21000000"))
      : false

    const isValidForm =
      isValidName && isPositiveBalance && isBalanceFittableInDb
    const form = { name, accountType, initialBalance }

    if (!isValidForm) {
      return {
        status: "error",
        form: { name, accountType, initialBalance },
        error: {
          name: isValidName ? undefined : "Must have a name.",
          initialBalance: !isValidBalance
            ? "Must be valid money."
            : !isPositiveBalance
              ? "Must be positive."
              : !isBalanceFittableInDb
                ? "Must be below $21,000,000."
                : undefined,
        },
      }
    }

    try {
      const res = await createAccount(user.id, {
        ...form,
        initialBalance: Money.parse(initialBalance).toInt(),
      })

      if (!res) {
        return {
          status: "error",
          form,
          error: { invalid: "Couldn't create the account." },
        }
      }

      return { status: "success" }
    } catch (err) {
      return {
        status: "error",
        form: { name, accountType, initialBalance },
        error: { invalid: "Couldn't create the account." },
      }
    }
  })

export const deleteAccountAction = async (
  accountId: string,
): Promise<DeleteAccountState> =>
  userMutation(async user => {
    const count = await deleteAccount(user.id, accountId)
    if (count > 0) await removeEmptyItems(user.id).catch(console.error)
    return count > 0
      ? { status: "success" }
      : { status: "error", error: "Couldn't delete account." }
  })
