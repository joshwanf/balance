import { useAppSelector } from "../../app/hooks"
import { selectCategoryById } from "../../features/categoriesSlice"
import { Money } from "../../utils/classes/Money"

interface Props {
  id: string
  checked: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}
export const CategoryCard: React.FC<Props> = props => {
  const { id, checked, onChange, ...rest } = props
  const c = useAppSelector(state => selectCategoryById(state, id))
  /** use Money class */
  const budgetedAmount = new Money(c.amount)
  const usedAmount = new Money(c.usedAmount)
  const isOverBudget = budgetedAmount.lt(usedAmount)
  const budgetedClasses = isOverBudget ? "bg-red-300" : "bg-green-300 "

  return (
    <tr className="border-2 border-red-500">
      <td>
        <input type="checkbox" checked={checked} onChange={onChange} />
      </td>
      <td className="py-2 text-left">{c.name}</td>
      <td>
        <span className={`${budgetedClasses} px-2 py-1 rounded-md`}>
          {budgetedAmount.s}
        </span>
      </td>
      <td className="py-2 text-left">{usedAmount.s}</td>
      <td>{c.amount}</td>
    </tr>
  )
}
