"use server"
import { login, logout } from "@/server/auth"
import { getFormData } from "@/server/utils/formData"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export type LoginState =
  | { status: "idle" }
  | {
      status: "error"
      form: { credential: string }
      error: {
        credential?: string
        password?: string
        invalid?: string
      }
    }

export const loginAction = async (
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> => {
  const actionType = getFormData(formData, "actionType")
  const credential =
    actionType === "demoLogin"
      ? "admin"
      : getFormData(formData, "credential").trim()
  const password =
    actionType === "demoLogin" ? "password" : getFormData(formData, "password")

  const isValidCredential = credential.length > 0
  const isValidPassword = password.length > 0
  const isValidForm = isValidCredential && isValidPassword

  if (!isValidForm) {
    return {
      status: "error",
      form: { credential },
      error: {
        credential: isValidCredential
          ? undefined
          : "Please enter a username or email.",
        password: isValidPassword ? undefined : "Please enter a password.",
      },
    }
  }

  const res = await login({ credential, password })
  if (res) {
    revalidatePath("/", "layout")
  } else {
    return {
      status: "error",
      form: { credential },
      error: {
        invalid: "Invalid credential or password.",
      },
    }
  }

  redirect("/my-balance")
}

export const logoutAction = async () => {
  await logout()
  revalidatePath("/", "layout")
  redirect("/")
}
