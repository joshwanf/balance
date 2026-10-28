"use client"
import { useActionState } from "react"
import * as Btn from "../../lib/Base/Button"
import { Errors } from "../../lib/ComponentLibrary/Errors"
import { createAccountAction, CreateAccountState } from "@/server/actions/auth"
import { LoadingSpinner } from "@/components/Skeletons/LoadingSpinner"

export const SignupForm = () => {
  const [state, action, isPending] = useActionState<
    CreateAccountState,
    FormData
  >(createAccountAction, {
    status: "idle",
  })

  const initialForm = {
    firstName: state.status === "error" ? state.form.firstName : "",
    lastName: state.status === "error" ? state.form.lastName : "",
    username: state.status === "error" ? state.form.username : "",
    email: state.status === "error" ? state.form.email : "",
    password: "",
  }

  return (
    <div className="border-2 bg-white rounded-md p-4 m-6">
      {state.status === "error" && state.error.invalid && (
        <Errors errors={state.error.invalid} />
      )}
      <form action={action} className="space-y-2">
        <label htmlFor="firstName">
          {state.status === "error" && state.error.firstName && (
            <Errors errors={state.error.firstName} />
          )}
          <p>First name</p>
          <input
            className="px-3 py-1 border border-slate-400 rounded-lg w-full hover:border-slate-600"
            defaultValue={initialForm.firstName}
            type="text"
            name="firstName"
            id="firstName"
          />
        </label>

        <label htmlFor="lastName">
          {state.status === "error" && state.error.lastName && (
            <Errors errors={state.error.lastName} />
          )}
          <p>Last name</p>
          <input
            className="px-3 py-1 border border-slate-400 rounded-lg w-full hover:border-slate-600"
            defaultValue={initialForm.lastName}
            type="text"
            name="lastName"
            id="lastName"
          />
        </label>

        <label htmlFor="username">
          {state.status === "error" && state.error.username && (
            <Errors errors={state.error.username} />
          )}
          <p>Username</p>
          <input
            className="px-3 py-1 border border-slate-400 rounded-lg w-full hover:border-slate-600"
            defaultValue={initialForm.username}
            type="text"
            name="username"
            id="username"
          />
        </label>

        <label htmlFor="email">
          {state.status === "error" && state.error.email && (
            <Errors errors={state.error.email} />
          )}
          <p>Email</p>
          <input
            className="px-3 py-1 border border-slate-400 rounded-lg w-full hover:border-slate-600"
            defaultValue={initialForm.email}
            type="email"
            name="email"
            id="email"
          />
        </label>

        <label htmlFor="password">
          {state.status === "error" && state.error.password && (
            <Errors errors={state.error.password} />
          )}
          <p>Password</p>
          <input
            className="px-3 py-1 border border-slate-400 rounded-lg w-full hover:border-slate-600"
            type="password"
            name="password"
            id="password"
          />
        </label>

        <label htmlFor="confirmPassword">
          {state.status === "error" && state.error.confirmPassword && (
            <Errors errors={state.error.confirmPassword} />
          )}
          <p>Confirm password</p>
          <input
            className="px-3 py-1 border border-slate-400 rounded-lg w-full hover:border-slate-600"
            type="password"
            name="confirmPassword"
            id="confirmPassword"
          />
        </label>

        <Btn.PrimaryButton disabled={isPending}>
          <div className="flex gap-2 items-center justify-center">
            {isPending && <LoadingSpinner />}Sign Up
          </div>
        </Btn.PrimaryButton>
      </form>
    </div>
  )
}
