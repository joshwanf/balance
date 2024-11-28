import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { listCategoriesThunk } from "../../utils/thunks/category"
import { memoizedSelectCArr } from "../../features/categoriesSlice"
import { CategoryCard } from "./CategoryCard"
import { EditCategory } from "./EditCategory"
export const CategoryList = () => {
  const dispatch = useAppDispatch()
  const [isLoaded, setIsLoaded] = useState(false)
  const [selectedCat, setSelectedCat] = useState<string | null>(null)
  const [showEditCat, setShowEditCat] = useState(false)

  const categories = useAppSelector(memoizedSelectCArr)

  const handleCheckboxCategory =
    (id: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log("event", e.target.checked)
      if (!e.target.checked) {
        return setSelectedCat(null)
      }
      setSelectedCat(id)
    }
  const handleEditCategory = (id: string) => {}

  useEffect(() => {
    if (!isLoaded) {
      dispatch(listCategoriesThunk())
      setIsLoaded(true)
    }
  }, [dispatch, setIsLoaded])
  return (
    <div>
      <div>
        <div className="flex flex-row justify-between">
          <div>Name</div>
          <div>
            <button
              className="border-2 disabled:text-gray-300"
              disabled={!Boolean(selectedCat)}
              onClick={e => setShowEditCat(true)}
            >
              Edit category
            </button>
          </div>
          <div>Filter</div>
          <div>Search</div>
        </div>
        {showEditCat && (
          <EditCategory
            id={selectedCat}
            submitEdit={() => setShowEditCat(false)}
          />
        )}
        <table className=" w-full border-collapse">
          <thead>
            <tr>
              <th></th>
              <th className="py-2 text-left">Category name</th>
              <th className="py-2 text-left">Budgeted amount</th>
              <th className="py-2 text-left">Used amount</th>
              <th className="py-2 text-left">extra</th>
            </tr>
          </thead>
          <tbody className="space-y-40">
            {categories &&
              categories.map(c => (
                <CategoryCard
                  key={c.id}
                  id={c.id}
                  checked={selectedCat === c.id}
                  onChange={e => setSelectedCat(e.target.checked ? c.id : null)}
                />
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
