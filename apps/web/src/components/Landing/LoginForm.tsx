"use client"
import { ReactNode, useActionState } from "react"
import { loginAction, LoginState } from "@/server/actions/auth"
import { PrimaryButton, TertiaryButton } from "@/lib/Base/Button"
import { Errors } from "@/lib/ComponentLibrary/Errors"
import { LoadingSpinner } from "@/components/Skeletons/LoadingSpinner"
import { useFormStatus } from "react-dom"

export const LoginForm = () => {
  const [state, action] = useActionState<LoginState, FormData>(loginAction, {
    status: "idle",
  })
  const credential = state.status === "error" ? state.form.credential : ""

  return (
    <div>
      <div className="bg-white border-0 border-slate-300 rounded-md p-4 space-y-2">
        {state.status === "error" && state.error.invalid && (
          <Errors errors={state.error.invalid} />
        )}
        <form className="space-y-2" action={action}>
          <label htmlFor="credential">
            {state.status === "error" && state.error.credential && (
              <Errors errors={state.error.credential} />
            )}
            <p>Email/username</p>
            <input
              className="px-3 py-1 border border-slate-400 rounded-lg w-full hover:border-slate-600"
              defaultValue={credential}
              type="text"
              name="credential"
              id="credential"
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

          <div className="flex flex-col space-y-2">
            <SubmitButton Button={PrimaryButton} value="login">
              Log in
            </SubmitButton>
            <SubmitButton Button={TertiaryButton} value="demoLogin">
              Log in as demo user
            </SubmitButton>
          </div>
        </form>
      </div>
    </div>
  )
}

const SubmitButton = ({
  Button,
  children,
  value,
}: {
  Button: typeof PrimaryButton
  children: ReactNode
  value: string
}) => {
  const { pending, data } = useFormStatus()
  const showSpinner =
    pending && value === (data?.get("actionType")?.toString() ?? "login")

  return (
    <Button name="actionType" value={value} disabled={pending}>
      <div className="flex gap-2 items-center justify-center">
        {showSpinner && <LoadingSpinner />}
        {children}
      </div>
    </Button>
  )
}
