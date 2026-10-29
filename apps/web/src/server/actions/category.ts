"use server"
import { requireUser } from "@/server/auth"
import {
  changeCategory,
  createCategory,
  deleteCategories,
} from "@/server/category"
import { getFormData } from "@/server/utils/formData"
import { isApiErrorBody } from "@/server/errors"
import { Money } from "@/server/utils/Money"
import { revalidatePath } from "next/cache"
import { monthFromSearchParams } from "@/utils/month"

export type CreateCategoryState =
  | { status: "idle" }
  | { status: "success" }
  | {
      status: "error"
      form: { name: string; amount: string }
      error: {
        name?: string
        amount?: string
        month?: string
        invalid?: string
      }
    }

export type DeleteCategoryState =
  | { status: "idle" }
  | { status: "success" }
  | {
      status: "error"
      selectedCategories: string[]
      error: { invalid?: string }
    }

export const createCategoryAction = async (
  _prev: CreateCategoryState,
  formData: FormData,
): Promise<CreateCategoryState> => {
  const user = await requireUser()

  const name = getFormData(formData, "name").trim()
  const amount = getFormData(formData, "amount")
  const month = monthFromSearchParams(getFormData(formData, "month"))

  const isValidName = name.length > 0
  const isAmountValidNumber = Money.isValidMoney(amount)
  const isValidForm = isValidName && isAmountValidNumber

  if (!isValidForm) {
    return {
      status: "error",
      form: { name, amount },
      error: {
        name: isValidName ? undefined : "Please enter a category name.",
        amount: isAmountValidNumber
          ? undefined
          : "Please enter a valid amount.",
      },
    }
  }

  const preparedAmount = Money.parse(amount).cents
  const preparedForm = { name, amount: preparedAmount, month }

  try {
    await createCategory(user.id, preparedForm)
  } catch (e) {
    if (isApiErrorBody(e)) {
      return {
        status: "error",
        form: { name, amount },
        error: { name: String(e.message) },
      }
    }
    throw e
  }
  revalidatePath("/my-balance/budgets", "page")

  return { status: "success" }
}

export const changeCategoryAction = async ({
  id,
  month,
  name,
  amount,
}: {
  id: string
  month: string
  name?: string
  amount?: string
}) => {
  const user = await requireUser()

  const result = await changeCategory(
    { userId: user.id, id, month },
    {
      name,
      amount: amount !== undefined ? Money.parse(amount).toInt() : undefined,
    },
  )

  if (result) {
    revalidatePath("/my-balance/budgets", "page")
  }
  return result
}

export const deleteCategoryAction = async (
  categoryIds: string[],
): Promise<DeleteCategoryState> => {
  const user = await requireUser()

  const count = await deleteCategories(user.id, categoryIds)

  revalidatePath("/my-balance/budgets", "page")
  return { status: "success" }
}
