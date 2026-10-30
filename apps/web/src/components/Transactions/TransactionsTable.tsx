"use client"
import { useState } from "react"
import type { ApiTypes } from "@balance/api-types"
import { TransactionCard } from "./TransactionCard"
import { TableHead } from "@/components/Table/TableHead"
import { TABLE_CLASS, TABLE_WRAPPER_CLASS } from "@/components/Table/layout"
import { TRANSACTION_COLUMNS, TRANSACTIONS_MIN_WIDTH } from "./columns"

type Transaction = ApiTypes.Transaction.TRow

interface Props {
  transactions: Transaction[]
  /** every tag the user has, for the tag picker */
  allTags: string[]
}

/** Server-fetched rows; the table only owns row selection. */
export const TransactionsTable = ({ transactions, allTags }: Props) => {
  const [selectedItem, setSelectedItem] = useState<string[]>([])
  const allTransIds = transactions.map(t => t.id)
  const checkAllItems =
    allTransIds.length > 0 && selectedItem.length === allTransIds.length

  const handleSelectItem =
    (id: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      e.stopPropagation()
      if (e.target.checked) {
        setSelectedItem([...selectedItem, id])
      } else {
        setSelectedItem(selectedItem.filter(i => i !== id))
      }
    }

  const handleSelectAllItems = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    setSelectedItem(e.target.checked ? allTransIds : [])
  }

  return (
    <div className={TABLE_WRAPPER_CLASS}>
      <table className={`${TABLE_CLASS} ${TRANSACTIONS_MIN_WIDTH}`}>
        <TableHead
          columns={TRANSACTION_COLUMNS}
          allChecked={checkAllItems}
          onCheckAll={handleSelectAllItems}
        />
        <tbody>
          {transactions.map(t => (
            <TransactionCard
              key={t.id}
              t={t}
              allTags={allTags}
              checked={selectedItem.includes(t.id)}
              onChange={handleSelectItem(t.id)}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
