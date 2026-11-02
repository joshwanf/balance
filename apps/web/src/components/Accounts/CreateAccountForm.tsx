"use client"
import { useActionState } from "react"
import { X } from "lucide-react"
import * as Btn from "../../lib/Base/Button"
import { Errors } from "../../lib/ComponentLibrary/Errors"
import {
  createAccountAction,
  CreateAccountState,
} from "@/server/actions/account"
import { LoadingSpinner } from "@/components/Skeletons/LoadingSpinner"

interface Props {
  closeForm?: () => void
}
export const CreateAccountForm = ({ closeForm, ...rest }: Props) => {
  const [state, action, isPending] = useActionState<
    CreateAccountState,
    FormData
  >(
    async (_prev, formData) => {
      const result = await createAccountAction(_prev, formData)
      if (result.status === "success" && closeForm) closeForm()
      return result
    },
    { status: "idle" },
  )

  const name = state.status === "error" ? state.form.name : ""
  const accountType =
    state.status === "error" ? state.form.accountType : "checking"
  const initialBalance =
    state.status === "error" ? state.form.initialBalance : ""
  const error = state.status === "error" ? state.error : {}

  return (
    <div className="relative p-4 w-full">
      <div
        className="absolute right-1 top-1 rounded-md p-1
        text-brand-400
        hover:cursor-pointer hover:bg-brand-200 hover:text-brand-700"
        onClick={closeForm}
      >
        <X />
      </div>

      <form action={action} className="flex flex-col gap-2">
        {error?.invalid && <Errors errors={error.invalid} />}
        <label htmlFor="name">
          Name
          {state.status === "error" && state.error.name && (
            <Errors errors={state.error.name} />
          )}
          <input
            className="px-3 py-1 border border-neutral-400 rounded-lg w-full hover:border-neutral-600"
            defaultValue={name}
            type="text"
            id="name"
            name="name"
            data-1p-ignore
          />
        </label>

        <div className="flex gap-2">
          Type:
          <input
            type="radio"
            value="checking"
            defaultChecked={accountType === "checking"}
            id="checking"
            name="accountType"
          />
          <label htmlFor="checking">Checking</label>
          <input
            type="radio"
            value="savings"
            defaultChecked={accountType === "savings"}
            id="savings"
            name="accountType"
          />
          <label htmlFor="savings">Savings</label>
        </div>

        <label htmlFor="initialBalance">
          Initial balance
          {state.status === "error" && state.error.initialBalance && (
            <Errors errors={state.error.initialBalance} />
          )}
          <input
            className="px-3 py-1 border border-neutral-400 rounded-lg w-full hover:border-neutral-600"
            defaultValue={initialBalance}
            type="number"
            id="initialBalance"
            name="initialBalance"
            step="0.01"
          />
        </label>

        <Btn.PrimaryButton additionalClasses={["py-1", "px-2", "bg-brand-50"]}>
          <div className="flex gap-2 items-center justify-center">
            {isPending && <LoadingSpinner />}Add new account
          </div>
        </Btn.PrimaryButton>
      </form>
    </div>
  )
}
