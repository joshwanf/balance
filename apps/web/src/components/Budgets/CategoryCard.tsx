"use client"
import { useState, useTransition } from "react"
import { useCurMonth } from "@/hooks/useUrlState"
import type { ApiTypes } from "@balance/api-types"
import { Money } from "@/utils/classes/Money"
import { EditableText } from "@/lib/ComponentLibrary/EditableText"
import { changeCategoryAction } from "@/server/actions/category"
import { Errors } from "@/lib/ComponentLibrary/Errors"
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
  const unifiedClassNames = `${isCheckedClassname} border-b-2`

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

  return (
    <tr className={unifiedClassNames}>
      <td className="pl-2">
        <div className="flex gap-2">
          <input type="checkbox" checked={checked} onChange={onChange} />
          {isPending && <LoadingSpinner />}
        </div>
      </td>

      <td className="py-2">
        <div className="flex gap-2">
          <EditableText
            text={c.name}
            onFinishEditing={handleChangeForm("name")}
          />

          {formErrors.name && <Errors errors={formErrors.name} />}
        </div>
      </td>

      <td className="py-2">
        <div className="flex gap-2 items-center">
          <span
            className={`${budgetedClasses} flex items-center px-2 py-1 rounded-md`}
          >
            <span className="select-none">{budgetedAmount.currencySymbol}</span>
            <EditableText
              text={`${budgetedAmount.format({ noCurrencySymbol: true })}`}
              type="number"
              onFinishEditing={handleChangeForm("amount")}
            />
          </span>

          {formErrors.budgetedAmount && (
            <Errors errors={formErrors.budgetedAmount} />
          )}
        </div>
      </td>

      <td className="py-2 text-left">{usedAmount.format()}</td>

      <td>
        <div className="grid grid-cols-[5%_auto]">
          <div className="text-right">{leftoverBudget.negSign}</div>
          <div>{leftoverBudget.format({ noNegSign: true })}</div>
        </div>
      </td>
    </tr>
  )
}
