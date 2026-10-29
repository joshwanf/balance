"use client"
import { useState } from "react"
import { AnimatePresence } from "motion/react"
import { CreateTransaction } from "./CreateTransaction"
import { SearchBar } from "./SearchBar"
import { SearchOptions } from "./SearchOptions"
import { PrimaryButton } from "../../lib/Base/Button"
import { searchTextToParams } from "../../utils/searchHelpers"
import { useSearchText } from "../../hooks/useUrlState"

interface Props {
  accounts: { id: string; name: string }[]
  categories: { id: string; name: string }[]
}

/** Add-transaction form and the search box above the table. */
export const TransactionsToolbar = ({ accounts, categories }: Props) => {
  const [showAddItem, setShowAddItem] = useState(false)
  const searchText = useSearchText()
  const searchParams = searchTextToParams(searchText)

  return (
    <div
      className="flex flex-col justify-between bg-grass-50
      px-4 py-4 rounded-2xl space-y-4"
    >
      <div className="flex flex-row justify-around items-center">
        <div className="w-1/4">
          <PrimaryButton
            onClick={() => setShowAddItem(!showAddItem)}
            className={`
                px-4 rounded-md border-2 
              ${!showAddItem ? "bg-grass-700" : "bg-grass-300"}
              ${!showAddItem ? "text-grass-200" : "text-grass-800"}
              ${!showAddItem ? "border-grass-700" : "border-grass-800"}
              `}
          >
            Add Transaction
          </PrimaryButton>
        </div>
        <div className="w-full space-y-2">
          <SearchBar searchText={searchText} />
          <SearchOptions searchTermParams={searchParams} />
        </div>
      </div>
      <AnimatePresence>
        {showAddItem && (
          <CreateTransaction
            accounts={accounts}
            categories={categories}
            onAfterSubmitForm={() => setShowAddItem(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
