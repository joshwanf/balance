import { Search } from "lucide-react"
import { useState } from "react"

interface Props {}

export const SearchBar: React.FC<Props> = props => {
  const [searchTerm, setSearchTerm] = useState("")
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    e.preventDefault()
  }
  return (
    <div
      className="flex items-center w-full
    border-2 border-grass-300 rounded-lg py-2 px-2
    focus-within:border-grass-600
    text-grass-700"
    >
      <Search />
      <input
        name="search"
        onChange={handleChange}
        className="w-full bg-transparent focus:outline-none
        placeholder:italic"
        placeholder="Search coming soon..."
      />
    </div>
  )
}
