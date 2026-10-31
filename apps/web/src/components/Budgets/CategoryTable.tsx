"use client"
import { useState, useTransition } from "react"
import type { ApiTypes } from "@balance/api-types"
import { CategoryCard } from "./CategoryCard"
import { deleteCategoryAction } from "@/server/actions/category"
import { LoadingSpinner } from "@/components/Skeletons/LoadingSpinner"
import { TableHead } from "@/components/Table/TableHead"
import {
  STACKED,
  TABLE_CLASS,
  TABLE_WRAPPER_CLASS,
} from "@/components/Table/layout"
import { CATEGORY_COLUMNS, CATEGORIES_MIN_WIDTH } from "./columns"

interface Props {
  /** this month's categories with budget and spend, fetched on the server */
  categories: ApiTypes.Category.TSerialized[]
}

/** The budgets table; owns row selection and deleting the selected rows. */
export const CategoryTable = ({ categories }: Props) => {
  const [isDeletePending, startDeleteTransition] = useTransition()
  const [selectedCat, setSelectedCat] = useState<string[]>([])

  const allCatIds = categories.map(c => c.id)
  const checkAllItems =
    allCatIds.length > 0 && selectedCat.length === allCatIds.length

  const handleSelectCat =
    (id: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      e.stopPropagation()
      if (e.target.checked) {
        setSelectedCat([...selectedCat, id])
      } else {
        setSelectedCat(selectedCat.filter(i => i !== id))
      }
    }

  const handleSelectAllItems = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    setSelectedCat(e.target.checked ? allCatIds : [])
  }

  const handleDeleteCats = () => {
    startDeleteTransition(async () => {
      const result = await deleteCategoryAction(selectedCat)
      if (result.status === "success") setSelectedCat([])
    })
  }

  const selectionBar = selectedCat.length > 0 && (
    <SelectionBar
      count={selectedCat.length}
      isPending={isDeletePending}
      onDelete={handleDeleteCats}
      onClear={() => setSelectedCat([])}
    />
  )

  return (
    <div>
      {/* Phones have no header row, so select-all and the selection actions
          live in a bar of the same height above the rows */}
      <div className="md:hidden flex h-10 items-center gap-3 border-b-2 px-2">
        <input
          type="checkbox"
          aria-label="Select all"
          checked={checkAllItems}
          onChange={handleSelectAllItems}
        />
        {selectionBar || (
          <span className="text-sm text-neutral-500">Select all</span>
        )}
      </div>
      <div className={TABLE_WRAPPER_CLASS}>
        <table
          className={`${TABLE_CLASS} ${CATEGORIES_MIN_WIDTH} ${STACKED.table}`}
        >
          <TableHead
            columns={CATEGORY_COLUMNS}
            allChecked={checkAllItems}
            onCheckAll={handleSelectAllItems}
            selectionBar={selectionBar}
            stacked
          />
          <tbody className={STACKED.body}>
            {categories.map(c => (
              <CategoryCard
                key={`${c.id}-${c.month}`}
                id={c.id}
                c={c}
                checked={selectedCat.includes(c.id)}
                onChange={handleSelectCat(c.id)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

interface SelectionBarProps {
  count: number
  isPending: boolean
  onDelete: () => void
  onClear: () => void
}

/** "n selected" with its actions; takes the header row's place, same height. */
const SelectionBar = ({
  count,
  isPending,
  onDelete,
  onClear,
}: SelectionBarProps) => (
  <div className="flex items-center gap-3 font-normal">
    <span className="tabular-nums">{count} selected</span>
    <button
      type="button"
      onClick={onClear}
      className="text-sm text-neutral-600 underline-offset-2 hover:underline"
    >
      Clear selected
    </button>
    <button
      type="button"
      onClick={onDelete}
      disabled={isPending}
      className="rounded-md border-2 border-danger-300 bg-danger-100 px-3 py-0.5 text-sm font-semibold text-danger-800
        hover:bg-danger-200 disabled:opacity-60"
    >
      {/* the spinner covers the label so the button keeps its size */}
      <span className="relative">
        <span className={isPending ? "invisible" : ""}>Delete</span>
        {isPending && (
          <span className="absolute inset-0 flex items-center justify-center">
            <LoadingSpinner />
          </span>
        )}
      </span>
    </button>
  </div>
)
