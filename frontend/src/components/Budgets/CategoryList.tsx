import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  listCategoriesThunk,
  removeCategoriesThunk,
} from "../../utils/thunks/category"
import {
  memoizedSelectCArr,
  selectCategories,
  selectCatIds,
} from "../../features/categoriesSlice"
import { CategoryCard } from "./CategoryCard"
import { EditCategory } from "./EditCategory"
import { AnimatePresence, motion } from "motion/react"
import { CreateCategory } from "./CreateCategory"
import { EditableText } from "../../lib/ComponentLibrary/EditableText"
export const CategoryList = () => {
  const dispatch = useAppDispatch()
  const curMonth = useAppSelector(state => state.session.settings.curMonth)
  const [isLoaded, setIsLoaded] = useState(false)
  const [selectedCat, setSelectedCat] = useState<string[]>([])
  const [checkAllItems, setCheckAllItems] = useState(false)
  const [showEditCat, setShowEditCat] = useState(false)

  const categories = useAppSelector(selectCategories)
  const allCatIds = Object.values(categories).map(c => c.id)

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

  const handleDeleteCats = async (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log("deleting categories", selectedCat)
    try {
      const res = await dispatch(
        removeCategoriesThunk({ categoryIds: selectedCat }),
      )
      setSelectedCat([])
      setCheckAllItems(false)
    } catch (e) {}
  }

  useEffect(() => {
    if (!isLoaded) {
      dispatch(listCategoriesThunk({ startMonth: curMonth }))
      setIsLoaded(true)
    }
  }, [dispatch, setIsLoaded, listCategoriesThunk])

  if (!isLoaded) {
    return <div>Loading categories</div>
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
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={e => setShowEditCat(!showEditCat)}
                className={`
                px-4 rounded-md border-2 
              ${!showEditCat ? "bg-grass-700" : "bg-grass-300"}
              ${!showEditCat ? "text-grass-200" : "text-grass-800"}
              ${!showEditCat ? "border-grass-700" : "border-grass-800"}
              `}
              >
                Add Category
              </motion.button>
            </div>
            <div>
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
            </div>
            <div>
              <motion.button
                whileTap={isDisabledDelete ? {} : { scale: 0.95 }}
                disabled={isDisabledDelete}
                onClick={handleDeleteCats}
                className={`px-4 rounded-md border-2 
              ${isDisabledDelete ? "bg-grass-200" : "bg-grass-700"}
              ${isDisabledDelete ? "text-grass-600" : "text-grass-200"}
              ${isDisabledDelete ? "border-grass-200" : "border-grass-700"}
              `}
              >
                Delete {selectedCat.length <= 1 ? "category" : "categories"}
              </motion.button>
            </div>
            <div>Search</div>
          </div>
          <AnimatePresence>
            {showEditCat && (
              <CreateCategory onAfterSubmitForm={() => setShowEditCat(false)} />
            )}
          </AnimatePresence>
        </div>
        <table className=" w-full border-collapse">
          <thead>
            <tr>
              <th className="py-2 pl-2 text-left">
                <input
                  type="checkbox"
                  checked={checkAllItems}
                  onChange={handleSelectAllItems}
                  onClick={e => e.stopPropagation()}
                />
              </th>
              <th className="py-2 text-left">Category name</th>
              <th className="py-2 text-left">Budgeted amount</th>
              <th className="py-2 text-left">Used amount</th>
              <th className="py-2 text-left">Available amount</th>
            </tr>
          </thead>
          <tbody className="space-y-40">
            {categories &&
              Object.values(categories).map(c => (
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
  )
}
