"use server"
import { createAccount, login, logout } from "@/server/auth"
import { validateEmail } from "@/utils/email"
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

export type CreateAccountState =
  | { status: "idle" }
  | {
      status: "error"
      form: {
        firstName: string
        lastName: string
        username: string
        email: string
      }
      error: {
        firstName?: string
        lastName?: string
        username?: string
        email?: string
        password?: string
        confirmPassword?: string
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

export const createAccountAction = async (
  _prev: CreateAccountState,
  formData: FormData,
): Promise<CreateAccountState> => {
  const firstName = getFormData(formData, "firstName").trim()
  const lastName = getFormData(formData, "lastName").trim()
  const username = getFormData(formData, "username").trim()
  const email = getFormData(formData, "email").trim()
  const password = getFormData(formData, "password")
  const confirmPassword = getFormData(formData, "confirmPassword")

  const isValidFirstName = firstName.length > 0
  const isValidLastName = lastName.length > 0
  const isValidUsername = username.length >= 4
  const isValidEmail = validateEmail(email)
  const isValidPassword = password.length >= 6
  const isMatchingPassword = password === confirmPassword
  const isValidForm =
    isValidFirstName &&
    isValidLastName &&
    isValidUsername &&
    isValidEmail &&
    isValidPassword &&
    isMatchingPassword

  if (!isValidForm) {
    return {
      status: "error",
      form: { firstName, lastName, username, email },
      error: {
        firstName: isValidFirstName ? undefined : "Please enter a first name.",
        lastName: isValidLastName ? undefined : "Please enter a last name.",
        username: isValidUsername
          ? undefined
          : "Please enter a username with at least 4 characters.",
        email: isValidEmail ? undefined : "Please enter a valid email.",
        password: isValidPassword
          ? undefined
          : "Please enter a password with at least 6 characters.",
        confirmPassword: isMatchingPassword
          ? undefined
          : "Please make sure the passwords match.",
      },
    }
  }

  const user = await createAccount({
    firstName,
    lastName,
    username,
    email,
    password,
  })

  if (user) {
    revalidatePath("/", "layout")
    redirect("/my-balance")
  } else {
    return {
      status: "error",
      form: { firstName, lastName, username, email },
      error: {
        invalid: "A user already exists with the username or email.",
      },
    }
  }
}
