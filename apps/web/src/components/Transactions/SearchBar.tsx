"use client"
import { Search } from "lucide-react"
import { useEffect, useState } from "react"
import { PrimaryButton } from "../../lib/Base/Button"
import { useSetSearchText } from "../../hooks/useUrlState"

interface Props {
  searchText: string
}

/** Search box; submitting writes the text to ?q= and the list reloads. */
export const SearchBar = ({ searchText }: Props) => {
  const setSearchText = useSetSearchText()
  const [text, setText] = useState(searchText)

  useEffect(() => {
    setText(searchText)
  }, [searchText])

  const handleSearch = () => setSearchText(text.trim())

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
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
        value={text}
        onChange={e => setText(e.target.value)}
        className="w-full min-w-0 bg-transparent focus:outline-none
        placeholder:italic"
        placeholder="Search..."
        onKeyDown={handleKeyDown}
      />
      <PrimaryButton onClick={handleSearch}>search</PrimaryButton>
    </div>
  )
}
