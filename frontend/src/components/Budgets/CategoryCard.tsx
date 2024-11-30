import { useState } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { EditableText } from "../../lib/ComponentLibrary/EditableText"
import { Money } from "../../utils/classes/Money"
import { ApiTypes } from "../../types/api"
import { changeCategoryThunk } from "../../utils/thunks/category"

interface ChangeForm {
  id: string
  month: string
  name?: string
  amount?: number
}
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
export const CategoryCard: React.FC<Props> = props => {
  const { id, c, checked, onChange, ...rest } = props

  const dispatch = useAppDispatch()
  const curMonth = useAppSelector(state => state.session.settings.curMonth)

  const [formErrors, setFormErrors] = useState<FormErrors>({})

  const budgetedAmount = Money.fromCents(c.amount.toString())
  const usedAmount = Money.fromCents(c.usedAmount?.toString())
  const isOverBudget = budgetedAmount.lt(usedAmount)
  const leftoverBudget = budgetedAmount.subtract(usedAmount)
  const budgetedClasses = isOverBudget ? "bg-red-300" : "bg-green-200 "

  const isCheckedClassname = checked ? "bg-blue-200" : ""
  const unifiedClassNames = `${isCheckedClassname} border-b-2`

  const handleChangeForm = (field: string) => async (newValue: string) => {
    const formWithUpdatedData: ChangeForm = {
      id: c.id,
      month: curMonth,
    }
    if (field === "name") {
      formWithUpdatedData.name = newValue
    } else if (field === "amount") {
      try {
        setFormErrors({})
        const newBudgetedAmount = Money.parse(newValue)
        formWithUpdatedData.amount = newBudgetedAmount.toInt()
      } catch (e) {
        if (typeof e === "string") {
          setFormErrors({ budgetedAmount: e })
        }
      }
    }

    /** change to thunk */
    const res = await dispatch(
      changeCategoryThunk(formWithUpdatedData),
    ).unwrap()
  }

  return (
    <tr className={unifiedClassNames}>
      <td className="pl-2">
        <input type="checkbox" checked={checked} onChange={onChange} />
      </td>
      <td className="py-2 text-left">
        <EditableText text={c.name} editText={handleChangeForm("name")} />
      </td>
      <td>
        <div>
          <span className={`${budgetedClasses} px-2 py-1 rounded-md`}>
            {budgetedAmount.currencySymbol}
            <EditableText
              text={`${budgetedAmount.format({ noCurrencySymbol: true })}`}
              editText={handleChangeForm("amount")}
            />
          </span>
        </div>
        {formErrors.budgetedAmount && <div>{formErrors.budgetedAmount}</div>}
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
