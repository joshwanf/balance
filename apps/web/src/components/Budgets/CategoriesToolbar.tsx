"use client"
import { useState, type ReactNode } from "react"
import { AnimatePresence } from "motion/react"
import { CreateCategory } from "./CreateCategory"
import { PrimaryButton } from "../../lib/Base/Button"

/**
 * The month's totals, then the add-category button and form, above the
 * budgets table. The button needs no data, so the page and its loading state
 * render it outside the table's Suspense boundary and it never disappears
 * while the table loads.
 */
export const CategoriesToolbar = ({ totals }: { totals: ReactNode }) => {
  const [showAddCat, setShowAddCat] = useState(false)

  return (
    <div className="flex flex-col space-y-3 pb-4">
      {totals}
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
