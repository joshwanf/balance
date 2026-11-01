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
import { CategoryColorPicker } from "@/components/Categories/CategoryColorPicker"
import { CategoryColor, categoryColor } from "@/theme/categoryColors"

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
  const budgetedClasses = isOverBudget
    ? "bg-danger-200 text-danger-900"
    : "bg-success-200 text-success-900"

  const isCheckedClassname = checked ? "bg-info-200" : ""
  // Below md the row stacks: name and available, then budget and used. At
  // every size a thin bar along the bottom shows how much of the budget is used
  const unifiedClassNames = `${isCheckedClassname} ${ROW_CLASS} ${STACKED.row} ${CATEGORY_ROW_HEIGHT} relative max-md:grid-cols-[1.5rem_minmax(0,1fr)_auto] max-md:px-2`
  // The bar spans the larger of budget and spend: green up to the budget, and
  // when over budget, red for the overspend
  const barTotal = Math.max(budgetedAmount.cents, usedAmount.cents)
  const withinPercent =
    barTotal > 0
      ? (Math.max(0, Math.min(budgetedAmount.cents, usedAmount.cents)) /
          barTotal) *
        100
      : 0
  const overPercent = isOverBudget
    ? ((usedAmount.cents - budgetedAmount.cents) / barTotal) * 100
    : 0
  // where green turns red, as a share of the filled part
  const splitPercent =
    withinPercent + overPercent > 0
      ? (withinPercent / (withinPercent + overPercent)) * 100
      : 100

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

  const handleChangeColor = (color: CategoryColor) => {
    startTransition(async () => {
      await changeCategoryAction({ id: c.id, month: curMonth, color })
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
        <div className="relative flex min-w-0 items-center gap-1">
          <CategoryColorPicker
            name={c.name}
            color={categoryColor(c)}
            onPick={handleChangeColor}
          />
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
            className={`${budgetedClasses} flex items-center rounded-full px-3 py-0.5`}
          >
            <span className="select-none">{budgetedAmount.currencySymbol}</span>
            <EditableText
              text={`${budgetedAmount.format({ noCurrencySymbol: true })}`}
              additionalClasses={["rounded-full"]}
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

      <td className="text-right pr-4 tabular-nums max-md:col-start-3 max-md:row-start-2 max-md:self-center max-md:pr-0 max-md:text-sm max-md:text-neutral-500">
        <span className="md:hidden">used </span>
        {usedAmount.format()}
      </td>

      <td className={`text-right pr-4 tabular-nums max-md:col-start-3 max-md:row-start-1 max-md:self-center max-md:pr-0 max-md:font-semibold ${isOverBudget ? "text-danger-600" : ""}`}>
        {leftoverBudget.format().replace(/^-/, "\u2212")}
      </td>

      <td
        aria-hidden
        className="absolute inset-x-0 -bottom-0.5 h-1 p-0 md:-bottom-[3px]"
      >
        <span
          className="block h-full"
          style={{
            width: `${withinPercent + overPercent}%`,
            backgroundImage: `linear-gradient(to right, rgb(var(--success-500)) ${splitPercent}%, rgb(var(--danger-500)) ${splitPercent}%)`,
          }}
        />
      </td>
    </tr>
  )
}
