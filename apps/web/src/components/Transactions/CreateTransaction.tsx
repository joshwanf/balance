"use client"
import { useActionState, useState } from "react"
import { FormField } from "../../lib/ComponentLibrary/FormField"
import { DropdownSelector } from "../../lib/ComponentLibrary/DropdownSelector"
import {
  createTransactionAction,
  type CreateTransactionState,
} from "@/server/actions/transaction"
import { m, LazyMotion, domAnimation } from "motion/react"
import { Errors } from "../../lib/ComponentLibrary/Errors"
import { PrimaryButton } from "../../lib/Base/Button"
import { LoadingSpinner } from "@/components/Skeletons/LoadingSpinner"
import { useLookups } from "@/components/Lookups/LookupsProvider"

interface Props {
  onAfterSubmitForm?: () => void
}
export const CreateTransaction = ({ onAfterSubmitForm }: Props) => {
  const { accounts, categories } = useLookups()

  const [state, action, isPending] = useActionState<
    CreateTransactionState,
    FormData
  >(
    async (prev, formData) => {
      const result = await createTransactionAction(prev, formData)
      if (result.status === "success" && onAfterSubmitForm) {
        onAfterSubmitForm()
      }
      return result
    },
    { status: "idle" },
  )
  const form = state.status === "error" ? state.form : undefined
  const error = state.status === "error" ? state.error : {}

  const [selectedAcct, setSelectedAcct] = useState(
    form?.accountId ?? accounts[0]?.id ?? "",
  )
  const [selectedCat, setSelectedCat] = useState(form?.categoryId ?? "")

  return (
    <LazyMotion features={domAnimation}>
      <m.form
        action={action}
        key="createTransaction"
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: "auto",
          opacity: 1,
          transition: {
            height: { duration: 0.2 },
            opacity: { duration: 0.1, delay: 0.2 },
          },
        }}
        exit={{
          height: 0,
          opacity: 0,
          transition: { height: { duration: 0.1 } },
        }}
        className="align-top shadow-xl
      bg-grass-50 py-6 px-2 rounded-lg border-2 border-grass-600"
      >
        <div className="grid grid-cols-2 text-sm">
          <FormField
            name="date"
            displayText="Date"
            placeholder="YYYY-MM-DD"
            defaultValue={form?.date}
          />
          {error.date ? <Errors errors={error.date} /> : <div></div>}
          <FormField
            name="payee"
            displayText="Payee"
            placeholder="Payee"
            defaultValue={form?.payee}
          />
          {error.payee ? <Errors errors={error.payee} /> : <div></div>}
          <DropdownSelector
            field="account"
            name="accountId"
            options={accounts}
            displayText="Account"
            disableBlankSelection={true}
            selected={selectedAcct}
            onChange={setSelectedAcct}
          />
          {error.account ? <Errors errors={error.account} /> : <div></div>}
          <FormField
            name="amount"
            displayText="Amount"
            placeholder="Amount"
            defaultValue={form?.amount}
          />
          {error.amount ? <Errors errors={error.amount} /> : <div></div>}
          <DropdownSelector
            field="category"
            name="categoryId"
            displayText="Category"
            options={categories}
            selected={selectedCat}
            onChange={setSelectedCat}
          />
        </div>
        {error.invalid && <Errors errors={error.invalid} />}
        <div>
          <PrimaryButton type="submit" disabled={isPending}>
            <div className="flex gap-2 items-center justify-center">
              {isPending && <LoadingSpinner />}Add transaction
            </div>
          </PrimaryButton>
        </div>
      </m.form>
    </LazyMotion>
  )
}
