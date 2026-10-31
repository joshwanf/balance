"use client"
import { useState, useTransition } from "react"
import { useCurMonth } from "@/hooks/useUrlState"
import type { ApiTypes } from "@balance/api-types"
import { Money } from "@/utils/classes/Money"
import { EditableText } from "@/lib/ComponentLibrary/EditableText"
import { changeCategoryAction } from "@/server/actions/category"
import { FloatingErrors } from "@/lib/ComponentLibrary/Errors"
import { ROW_CLASS, STACKED } from "@/components/Table/layout"
import { CATEGORY_ROW_HEIGHT } from "./columns"
import { LoadingSpinner } from "@/components/Skeletons/LoadingSpinner"

interface FormErrors {
  name?: string
  budgetedAmount?: string
}
interface Props {
  id: string
  c: ApiTypes.Category.TSerialized
  checked: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}
export const CategoryCard = ({ id, c, checked, onChange, ...rest }: Props) => {
  const curMonth = useCurMonth()

  const [isPending, startTransition] = useTransition()

  const [formErrors, setFormErrors] = useState<FormErrors>({})

  const budgetedAmount = Money.fromCents(c.amount.toString())
  const usedAmount = Money.fromCents(c.usedAmount?.toString())
  const isOverBudget = budgetedAmount.lt(usedAmount)
  const leftoverBudget = budgetedAmount.subtract(usedAmount)
  const budgetedClasses = isOverBudget ? "bg-red-300" : "bg-green-200 "

  const isCheckedClassname = checked ? "bg-blue-200" : ""
  // Below md the row stacks: name and available, then budget and used, with a
  // thin bar along the bottom for how much of the budget is used
  const unifiedClassNames = `${isCheckedClassname} ${ROW_CLASS} ${STACKED.row} ${CATEGORY_ROW_HEIGHT} max-md:relative max-md:grid-cols-[1.5rem_minmax(0,1fr)_auto] max-md:px-2`
  const usedPercent =
    budgetedAmount.cents > 0
      ? Math.min(100, (usedAmount.cents / budgetedAmount.cents) * 100)
      : 0

  const handleChangeForm =
    (field: "name" | "amount") => async (newValue: string) => {
      const isValidName = field === "name" ? newValue.length > 0 : true
      const isValidAmount =
        field === "amount" ? Money.isValidMoney(newValue) : true

      if (!isValidName || !isValidAmount) {
        setFormErrors({
          name: isValidName ? undefined : "Please enter a name.",
          budgetedAmount: isValidAmount
            ? undefined
            : "Please enter a valid money value.",
        })
        return false
      }

      return new Promise<boolean>(resolve => {
        startTransition(async () => {
          const result = await changeCategoryAction({
            id: c.id,
            month: curMonth,
            [field]: newValue,
          })

          if (result.status === "success") {
            setFormErrors({})
          }
          resolve(result.status === "success")
        })
      })
    }

  const clearError = (field: keyof FormErrors) => () =>
    setFormErrors(prev => ({ ...prev, [field]: undefined }))

  return (
    <tr className={unifiedClassNames}>
      <td className="pl-2 max-md:row-span-2 max-md:self-center max-md:pl-0">
        <div className="flex gap-2 items-center max-md:flex-col max-md:gap-1">
          <input type="checkbox" checked={checked} onChange={onChange} />
          {/* always takes its space, so saving doesn't widen the column */}
          <span
            className={isPending ? "" : "invisible"}
            aria-hidden={!isPending}
          >
            <LoadingSpinner />
          </span>
        </div>
      </td>

      <td className="pr-4 max-md:col-start-2 max-md:row-start-1 max-md:pr-0">
        <div className="relative">
          <EditableText
            text={c.name}
            onFinishEditing={handleChangeForm("name")}
            onCancel={clearError("name")}
          />
          {formErrors.name && (
            <FloatingErrors
              errors={formErrors.name}
              onDismiss={clearError("name")}
            />
          )}
        </div>
      </td>

      <td className="pr-4 max-md:col-start-2 max-md:row-start-2 max-md:pr-0">
        <div className="relative max-md:w-36">
          <span
            className={`${budgetedClasses} flex items-center px-2 py-0.5 rounded-md`}
          >
            <span className="select-none">{budgetedAmount.currencySymbol}</span>
            <EditableText
              text={`${budgetedAmount.format({ noCurrencySymbol: true })}`}
              type="number"
              onFinishEditing={handleChangeForm("amount")}
              onCancel={clearError("budgetedAmount")}
            />
          </span>
          {formErrors.budgetedAmount && (
            <FloatingErrors
              errors={formErrors.budgetedAmount}
              onDismiss={clearError("budgetedAmount")}
            />
          )}
        </div>
      </td>

      <td className="text-right pr-4 tabular-nums max-md:col-start-3 max-md:row-start-2 max-md:self-center max-md:pr-0 max-md:text-sm max-md:text-slate-500">
        <span className="md:hidden">used </span>
        {usedAmount.format()}
      </td>

      <td className="text-right pr-4 tabular-nums max-md:col-start-3 max-md:row-start-1 max-md:self-center max-md:pr-0 max-md:font-semibold">
        {leftoverBudget.format().replace(/^-/, "\u2212")}
      </td>

      <td
        aria-hidden
        className={`md:hidden absolute bottom-0 left-0 h-1 ${isOverBudget ? "bg-red-400" : "bg-grass-500"}`}
        style={{ width: `${usedPercent}%` }}
      />
    </tr>
  )
}
