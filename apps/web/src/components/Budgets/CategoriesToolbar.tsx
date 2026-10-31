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
    <div className="flex flex-col bg-brand-100 space-y-2 px-4 py-4 rounded-2xl">
      <div>
        <PrimaryButton
          onClick={() => setShowAddCat(!showAddCat)}
          className={`w-full sm:w-auto px-4 rounded-md border-2
            ${!showAddCat ? "bg-brand-700" : "bg-brand-300"}
            ${!showAddCat ? "text-brand-200" : "text-brand-800"}
            ${!showAddCat ? "border-brand-700" : "border-brand-800"}
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
