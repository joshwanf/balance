"use client"
import { useState } from "react"
import { AnimatePresence } from "motion/react"
import { CreateTransaction } from "./CreateTransaction"
import { SearchBar } from "./SearchBar"
import { SearchOptions } from "./SearchOptions"
import { PrimaryButton } from "../../lib/Base/Button"
import { searchTextToParams } from "../../utils/searchHelpers"
import { useSearchText } from "../../hooks/useUrlState"

/** Add-transaction form and the search box above the table. */
export const TransactionsToolbar = () => {
  const [showAddItem, setShowAddItem] = useState(false)
  const searchText = useSearchText()
  const searchParams = searchTextToParams(searchText)

  return (
    <div
      className="flex flex-col justify-between bg-grass-50
      px-4 py-4 rounded-2xl space-y-4"
    >
      {/* Phones: search on top, full-width Add below. From sm: side by side */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="order-2 sm:order-1 shrink-0">
          <PrimaryButton
            onClick={() => setShowAddItem(!showAddItem)}
            className={`
                w-full sm:w-auto whitespace-nowrap px-4 rounded-md border-2 
              ${!showAddItem ? "bg-grass-700" : "bg-grass-300"}
              ${!showAddItem ? "text-grass-200" : "text-grass-800"}
              ${!showAddItem ? "border-grass-700" : "border-grass-800"}
              `}
          >
            Add Transaction
          </PrimaryButton>
        </div>
        <div className="order-1 sm:order-2 w-full min-w-0 space-y-2">
          <SearchBar searchText={searchText} />
          <SearchOptions searchTermParams={searchParams} />
        </div>
      </div>
      <AnimatePresence>
        {showAddItem && (
          <CreateTransaction onAfterSubmitForm={() => setShowAddItem(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}
