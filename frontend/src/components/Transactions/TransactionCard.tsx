import { useState } from "react"
import { ApiTypes } from "../../types/api"
import { EditableText } from "../../lib/ComponentLibrary/EditableText"
import * as Btn from "../../lib/Base/Button"
import * as Ipt from "../../lib/Base/Input"
import balance from "../../utils/api"
import { SideModal } from "../../lib/ComponentLibrary/SideModal"
import { Modal } from "../../lib/ComponentLibrary/Modal"
import { TransactionDetails } from "./TransactionDetails"
import { Money } from "../../utils/classes/Money"
import { useAppSelector } from "../../app/hooks"
import { selectCategories } from "../../features/categoriesSlice"
import { selectAccounts } from "../../features/accountsSlice"
import { AnimatePresence } from "motion/react"

type Transaction = ApiTypes.Transaction.TSerialized

interface Props {
  t: Transaction
  checked: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}
export const TransactionCard: React.FC<Props> = props => {
  const { t, checked, onChange, ...rest } = props
  const categories = useAppSelector(selectCategories)
  const accounts = useAppSelector(selectAccounts)
  const [form, setForm] = useState(t)
  const [showModal, setShowModal] = useState(false)
  const tAmount = Money.fromCents(`${t.amount}`)

  const hasCategory = t.categoryId
  const isCheckedClassname = checked ? "bg-blue-200" : ""
  const unifiedClassNames = `${isCheckedClassname} hover:cursor-pointer hover:shadow-md hover:shadow-slate-200 border-b-2`
  const closeModal = (
    e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>,
  ) => {
    e.stopPropagation()
    setShowModal(false)
  }
  const openModal = (e: React.MouseEvent<HTMLTableRowElement>) => {
    e.stopPropagation()
    setShowModal(true)
  }

  return (
    <tr className={unifiedClassNames} onClick={openModal}>
      <td onClick={e => e.stopPropagation()} className="pl-2">
        <input
          type="checkbox"
          name={t.id}
          checked={checked}
          onChange={onChange}
          onClick={e => e.stopPropagation()}
        />
      </td>
      <td className="py-2 text-left">{t.date}</td>
      <td>{t.payee}</td>
      <td>{accounts[t.accountId]?.name}</td>
      <td className="py-2 text-left">{tAmount.format()}</td>
      <td>{t.categoryId ? categories[t.categoryId]?.name : "(unassigned)"}</td>
      <AnimatePresence>
        {showModal && (
          <SideModal
            selector="#transactionDetailNode"
            closeModal={closeModal}
            element={<TransactionDetails closeModal={closeModal} t={t} />}
          />
        )}
      </AnimatePresence>
    </tr>
  )
}
