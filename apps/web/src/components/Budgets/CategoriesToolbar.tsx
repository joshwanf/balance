"use client"
import { useState } from "react"
import { AnimatePresence } from "motion/react"
import { CreateCategory } from "./CreateCategory"
import { PrimaryButton } from "../../lib/Base/Button"

/**
 * Add-category button and form above the budgets table. It needs no data, so
 * the page and its loading state render it outside the table's Suspense
 * boundary and it never disappears while the table loads.
 */
export const CategoriesToolbar = () => {
  const [showAddCat, setShowAddCat] = useState(false)

  return (
    <div className="flex flex-col bg-grass-100 space-y-2 px-4 py-4 rounded-2xl">
      <div>
        <PrimaryButton
          onClick={() => setShowAddCat(!showAddCat)}
          className={`w-full sm:w-auto px-4 rounded-md border-2
            ${!showAddCat ? "bg-grass-700" : "bg-grass-300"}
            ${!showAddCat ? "text-grass-200" : "text-grass-800"}
            ${!showAddCat ? "border-grass-700" : "border-grass-800"}
            `}
        >
          Add Category
        </PrimaryButton>
      </div>
      <AnimatePresence>
        {showAddCat && (
          <CreateCategory onAfterSubmitForm={() => setShowAddCat(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}
