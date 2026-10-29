"use client"
import { useState } from "react"
import type { ApiTypes } from "@balance/api-types"
import { SideModal } from "../../lib/ComponentLibrary/SideModal"
import { TransactionDetails } from "./TransactionDetails"
import { Money } from "../../utils/classes/Money"
import { AnimatePresence } from "motion/react"

type Transaction = ApiTypes.Transaction.TRow

interface Props {
  accounts: { id: string; name: string }[]
  categories: { id: string; name: string }[]
  t: Transaction
  allTags: string[]
  checked: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}
export const TransactionCard = ({
  accounts,
  categories,
  t,
  allTags,
  checked,
  onChange,
}: Props) => {
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
      <td>{t.accountName}</td>
      <td className="py-2 text-left">{tAmount.format()}</td>
      <td>{t.categoryName ?? "(unassigned)"}</td>
      <AnimatePresence>
        {showModal && (
          <SideModal
            selector="#transactionDetailNode"
            closeModal={closeModal}
            element={
              <TransactionDetails
                accounts={accounts}
                categories={categories}
                closeModal={closeModal}
                t={t}
                allTags={allTags}
              />
            }
          />
        )}
      </AnimatePresence>
    </tr>
  )
}
