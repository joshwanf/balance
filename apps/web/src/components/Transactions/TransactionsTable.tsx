"use client"
import { useState } from "react"
import type { ApiTypes } from "@balance/api-types"
import { TransactionCard } from "./TransactionCard"

type Transaction = ApiTypes.Transaction.TRow

interface Props {
  accounts: { id: string; name: string }[]
  categories: { id: string; name: string }[]
  transactions: Transaction[]
  /** every tag the user has, for the tag picker */
  allTags: string[]
}

/** Server-fetched rows; the table only owns row selection. */
export const TransactionsTable = ({
  accounts,
  categories,
  transactions,
  allTags,
}: Props) => {
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
    <table className=" w-full border-collapse">
      <thead>
        <tr>
          <th className="py-2 pl-2 text-left">
            <input
              type="checkbox"
              name="allTransactions"
              checked={checkAllItems}
              onChange={handleSelectAllItems}
              onClick={e => e.stopPropagation()}
            />
          </th>
          <th className="py-2 text-left">Date</th>
          <th className="py-2 text-left">Payee</th>
          <th className="py-2 text-left">Account</th>
          <th className="py-2 text-left">Amount</th>
          <th className="py-2 text-left">Category</th>
        </tr>
      </thead>
      <tbody className="space-y-40">
        {transactions.map(t => (
          <TransactionCard
            accounts={accounts}
            categories={categories}
            key={t.id}
            t={t}
            allTags={allTags}
            checked={selectedItem.includes(t.id)}
            onChange={handleSelectItem(t.id)}
          />
        ))}
      </tbody>
    </table>
  )
}
