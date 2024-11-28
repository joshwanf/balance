import { useRef, useState } from "react"
import { useAppSelector } from "../../app/hooks"
import { selectCategories } from "../../features/categoriesSlice"
import { DropdownSelector } from "../../lib/ComponentLibrary/DropdownSelector"

interface Props {
  selectedCat?: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}
export const CategorySelector: React.FC<Props> = props => {
  const { selectedCat, onChange, ...rest } = props
  const categories = Object.values(useAppSelector(selectCategories))
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedOption, setSelectedOption] = useState(selectedCat)
  const categoryRef = useRef(null)
  return (
    <div className="relative">
      <DropdownSelector
        options={categories}
        onChange={onChange}
        defaultSelected={selectedCat}
      />
      {/* <button onClick={() => setShowDropdown(!showDropdown)}>Category</button>
      {showDropdown && (
        <div className="absolute z-10 bg-white" ref={categoryRef}>
          {categories.map(c => (
            <div key={c.id}>{c.name}</div>
          ))}
        </div>
      )} */}
    </div>
  )
}
