import { Search } from "lucide-react"
import { useEffect, useState } from "react"
import { PrimaryButton } from "../../lib/Base/Button"
import { searchTextToParams } from "../../utils/searchHelpers"
import balance from "../../utils/api"
import { ApiError } from "../../utils/classes/ApiError"
import { useAppDispatch } from "../../app/hooks"
import { addManyTs } from "../../features/transactionsSlice"

interface Props {
  searchTermText: [string, (term: string) => void]
}

export const SearchBar: React.FC<Props> = props => {
  const dispatch = useAppDispatch()
  const [searchText, setSearchText] = props.searchTermText
  const [text, setText] = useState(searchText)
  const [errors, setErrors] = useState("")

  useEffect(() => {
    setText(searchText)
  }, [searchText])

  const handleSearch = async () => {
    setSearchText(text)
    const searchParams = searchTextToParams(text)

    const res = await balance.transaction.search(searchParams)
    if (res instanceof ApiError) {
      return setErrors(res.err.error)
    }
    const transactions = res.transactions
    dispatch(addManyTs(transactions))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // const searchParams = searchTextToParams(searchText)
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
        className="w-full bg-transparent focus:outline-none
        placeholder:italic"
        placeholder="Search..."
        onKeyDown={handleKeyDown}
      />
      <PrimaryButton onClick={handleSearch}>search</PrimaryButton>
    </div>
  )
}
