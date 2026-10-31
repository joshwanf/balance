"use client"
import { useState, useTransition } from "react"
import type { ApiTypes } from "@balance/api-types"
import { CategoryCard } from "./CategoryCard"
import { AnimatePresence } from "motion/react"
import { CreateCategory } from "./CreateCategory"
import { PrimaryButton } from "../../lib/Base/Button"
import { deleteCategoryAction } from "@/server/actions/category"
import { LoadingSpinner } from "@/components/Skeletons/LoadingSpinner"
import { TableHead } from "@/components/Table/TableHead"
import { TABLE_CLASS, TABLE_WRAPPER_CLASS } from "@/components/Table/layout"
import { CATEGORY_COLUMNS, CATEGORIES_MIN_WIDTH } from "./columns"

interface Props {
  /** this month's categories with budget and spend, fetched on the server */
  categories: ApiTypes.Category.TSerialized[]
}

/** Toolbar and table for the budgets page; owns selection and the add form. */
export const CategoryTable = ({ categories }: Props) => {
  const [isDeletePending, startDeleteTransition] = useTransition()

  const [selectedCat, setSelectedCat] = useState<string[]>([])
  const [checkAllItems, setCheckAllItems] = useState(false)
  const [showEditCat, setShowEditCat] = useState(false)

  const allCatIds = categories.map(c => c.id)

  const isDisabledDelete = selectedCat.length < 1

  const handleSelectCat =
    (id: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      e.stopPropagation()
      if (e.target.checked) {
        setSelectedCat([...selectedCat, id])
      } else {
        const nextSelectedItems = selectedCat.filter(i => i !== id)
        setSelectedCat(nextSelectedItems)
      }
    }

  const handleSelectAllItems = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    if (e.target.checked) {
      setSelectedCat(allCatIds)
      setCheckAllItems(true)
    } else {
      setSelectedCat([])
      setCheckAllItems(false)
    }
  }

  const handleDeleteCats = () => {
    startDeleteTransition(async () => {
      const result = await deleteCategoryAction(selectedCat)
      if (result.status === "success") {
        setSelectedCat([])
        setCheckAllItems(false)
      }
    })
  }

  return (
    <div>
      <div>
        <div
          className="flex flex-col justify-between bg-grass-100 space-y-2
      px-4 py-4 rounded-2xl"
        >
          <div className="flex flex-row justify-around">
            <div>
              <PrimaryButton
                onClick={() => setShowEditCat(!showEditCat)}
                className={`px-4 rounded-md border-2 
                  ${!showEditCat ? "bg-grass-700" : "bg-grass-300"}
                  ${!showEditCat ? "text-grass-200" : "text-grass-800"}
                  ${!showEditCat ? "border-grass-700" : "border-grass-800"}
                  `}
              >
                Add Category
              </PrimaryButton>
            </div>
            {/* <div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className={`
                px-4 rounded-md border-2 
              ${!showEditCat ? "bg-grass-700" : "bg-grass-300"}
              ${!showEditCat ? "text-grass-200" : "text-grass-800"}
              ${!showEditCat ? "border-grass-700" : "border-grass-800"}
              `}
              >
                Fill from previous month
              </motion.button>
            </div> */}
            <div>
              <PrimaryButton
                disabled={isDisabledDelete}
                onClick={handleDeleteCats}
                className={`px-4 rounded-md border-2 
                  ${isDisabledDelete ? "bg-grass-200" : "bg-grass-700"}
                  ${isDisabledDelete ? "text-grass-600" : "text-grass-200"}
                  ${isDisabledDelete ? "border-grass-200" : "border-grass-700"}
                  `}
              >
                <div className="flex gap-2 items-center">
                  {/* spinner keeps its space so the button doesn't grow */}
                  <span className={isDeletePending ? "" : "invisible"}>
                    <LoadingSpinner />
                  </span>
                  Delete selected
                </div>
              </PrimaryButton>
            </div>
            <div>Search</div>
          </div>
          <AnimatePresence>
            {showEditCat && (
              <CreateCategory onAfterSubmitForm={() => setShowEditCat(false)} />
            )}
          </AnimatePresence>
        </div>
        <div className={TABLE_WRAPPER_CLASS}>
          <table className={`${TABLE_CLASS} ${CATEGORIES_MIN_WIDTH}`}>
            <TableHead
              columns={CATEGORY_COLUMNS}
              allChecked={checkAllItems}
              onCheckAll={handleSelectAllItems}
            />
            <tbody>
              {categories.map(c => (
                <CategoryCard
                  key={`${c.id}-${c.month}`}
                  id={c.id}
                  c={c}
                  checked={selectedCat?.includes(c.id)}
                  onChange={handleSelectCat(c.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
