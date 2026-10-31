"use client"
import { useState } from "react"
import type { ApiTypes } from "@balance/api-types"
import { SideModal } from "../../lib/ComponentLibrary/SideModal"
import { TransactionDetails } from "./TransactionDetails"
import { Money } from "../../utils/classes/Money"
import { AnimatePresence } from "motion/react"
import { Landmark } from "lucide-react"
import { ROW_CLASS, STACKED } from "@/components/Table/layout"

type Transaction = ApiTypes.Transaction.TRow

interface Props {
  t: Transaction
  allTags: string[]
  checked: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}
export const TransactionCard = ({ t, allTags, checked, onChange }: Props) => {
  const [showModal, setShowModal] = useState(false)
  const tAmount = Money.fromCents(`${t.amount}`)

  const hasCategory = t.categoryId
  const isCheckedClassname = checked ? "bg-blue-200" : ""
  // Below md the row stacks: payee and amount, then date, account and category
  const unifiedClassNames = `${isCheckedClassname} ${ROW_CLASS} ${STACKED.row} max-md:grid-cols-[1.5rem_minmax(0,1fr)_auto] max-md:px-2 hover:cursor-pointer hover:shadow-md hover:shadow-slate-200`
  const amount = tAmount.format().replace(/^-/, "\u2212")
  const closeModal = (
    e?: React.MouseEvent<HTMLDivElement | HTMLButtonElement>,
  ) => {
    e?.stopPropagation()
    setShowModal(false)
  }
  const openModal = (e: React.MouseEvent<HTMLTableRowElement>) => {
    e.stopPropagation()
    setShowModal(true)
  }

  return (
    <tr className={unifiedClassNames} onClick={openModal}>
      <td
        onClick={e => e.stopPropagation()}
        className="pl-2 max-md:row-span-2 max-md:self-center max-md:pl-0"
      >
        <input
          type="checkbox"
          name={t.id}
          checked={checked}
          onChange={onChange}
          onClick={e => e.stopPropagation()}
        />
      </td>
      <td className="tabular-nums max-md:hidden">{t.date}</td>
      <td className="max-md:col-start-2 max-md:row-start-1">
        <div className="flex items-center gap-2 min-w-0 pr-2">
          {t.plaidTransactionId && (
            <span title="Imported from your bank" className="shrink-0">
              <Landmark className="size-4 text-slate-400" />
            </span>
          )}
          <span className="truncate" title={t.payee}>
            {t.payee}
          </span>
          {t.pending && (
            <span className="shrink-0 rounded-full bg-amber-100 px-2 text-xs text-amber-800">
              Pending
            </span>
          )}
        </div>
      </td>
      <td className="truncate pr-2 max-md:hidden" title={t.accountName}>
        {t.accountName}
      </td>
      <td className="text-right pr-4 tabular-nums max-md:col-start-3 max-md:row-start-1 max-md:pr-0">
        {amount}
      </td>
      <td className="truncate max-md:hidden">
        {t.categoryName ?? "(unassigned)"}
      </td>
      <td className="md:hidden col-start-2 col-span-2 row-start-2 truncate text-sm text-slate-500">
        {t.date} · {t.accountName} · {t.categoryName ?? "(unassigned)"}
      </td>
      <AnimatePresence>
        {showModal && (
          <SideModal
            selector="#transactionDetailNode"
            title={t.payee}
            closeModal={closeModal}
            element={
              <TransactionDetails
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
