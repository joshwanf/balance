"use client"
import { useCurMonth } from "../../hooks/useUrlState"
import { useActionState } from "react"
import { m, LazyMotion, domAnimation } from "motion/react"
import { CirclePlus } from "lucide-react"
import { FormField } from "../../lib/ComponentLibrary/FormField"
import { PrimaryButton } from "../../lib/Base/Button"
import { Errors } from "../../lib/ComponentLibrary/Errors"
import {
  createCategoryAction,
  CreateCategoryState,
} from "@/server/actions/category"
import { LoadingSpinner } from "@/components/Skeletons/LoadingSpinner"

interface Props {
  onAfterSubmitForm?: () => void
}
export const CreateCategory = ({ onAfterSubmitForm, ...rest }: Props) => {
  const month = useCurMonth()

  const [state, action, isPending] = useActionState<
    CreateCategoryState,
    FormData
  >(
    async (_prev, formData) => {
      const result = await createCategoryAction(_prev, formData)
      if (result.status === "success" && onAfterSubmitForm) onAfterSubmitForm()
      return result
    },
    { status: "idle" },
  )

  const name = state.status === "error" ? state.form.name : ""
  const amount = state.status === "error" ? state.form.amount : ""
  const createErrors = state.status === "error" ? state.error : {}

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        key="createCategory"
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
          transition: { height: { duration: 0.2 }, opacity: { duration: 0.2 } },
        }}
        className="align-top shadow-xl
      bg-grass-50 py-6 px-2 rounded-lg border-2 border-grass-600"
      >
        <form
          action={action}
          className="flex flex-col lg:flex-row gap-2 lg:space-x-2 w-fit items-end text-sm"
        >
          <input type="hidden" value={month} name="month" />

          <div className="w-full lg:w-fit">
            <FormField
              name="name"
              displayText="Name"
              placeholder="Category name..."
              defaultValue={name}
              data-1p-ignore
            />
            {createErrors.name && <Errors errors={createErrors.name} />}
          </div>

          <div className="w-full lg:w-fit">
            <FormField
              name="amount"
              displayText="Amount"
              placeholder="Amount..."
              defaultValue={amount}
              type="number"
            />
            {createErrors.amount && <Errors errors={createErrors.amount} />}
          </div>

          <div>
            <PrimaryButton
              className={`flex items-center px-4 py-0.5
                border-2 rounded-md 
                border-grass-700 hover:border-grass-600 disabled:border-grass-300 
                text-grass-700 hover:text-grass-600 disabled:text-grass-300`}
              disabled={isPending}
            >
              <div className="flex gap-2 items-center justify-center">
                {isPending ? <LoadingSpinner /> : <CirclePlus size={18} />}Add
                new category
              </div>
            </PrimaryButton>
          </div>
        </form>
      </m.div>
    </LazyMotion>
  )
}
