import { useState } from "react"
import { useAppDispatch } from "../../app/hooks"
import { Pill } from "../../lib/Base/Pill/Pill"
import balance from "../../utils/api"
import { ApiError } from "../../utils/classes/ApiError"
import { QueryParams, searchParamsToText } from "../../utils/searchHelpers"
import { addManyTs } from "../../features/transactionsSlice"

interface Props {
  searchTermParams: Partial<QueryParams>
  searchTermText: [string, (text: string) => void]
}

export const SearchOptions: React.FC<Props> = props => {
  const dispatch = useAppDispatch()
  const searchTermParams = props.searchTermParams
  const [searchTermText, setSearchTermText] = props.searchTermText
  const hasSearchParams = Object.keys(searchTermParams).length > 0
  const [errors, setErrors] = useState("") // blackhole for transaction thunk :dead:

  const { generalSearch, tags, ...restOfSearch } = searchTermParams
  const displayText =
    generalSearch && generalSearch.length > 0 ? "Searching for " : "Searching "

  const triggerSearch = async (params: Partial<QueryParams>) => {
    const res = await balance.transaction.search(params)
    if (res instanceof ApiError) {
      return setErrors(res.err.error)
    }
    const transactions = res.transactions
    dispatch(addManyTs(transactions))
  }
  const handleRemoveGeneralSearch = async (term: string) => {
    const newTerms = generalSearch?.filter(t => t !== term) || []
    const newParams = { ...searchTermParams, generalSearch: newTerms }
    const newText = searchParamsToText(newParams)
    setSearchTermText(newText)
    triggerSearch(newParams)
  }

  const handleRemoveTag = async (tag: string) => {
    if (tags) {
      const newTags = tags.filter(t => t !== tag)
      const newParams = { ...searchTermParams, tags: newTags }
      const newText = searchParamsToText(newParams)
      setSearchTermText(newText)
      triggerSearch(newParams)
    }
  }

  const handleRemoveTerm = async (field: keyof QueryParams) => {
    const newParams = Object.fromEntries(
      Object.entries(searchTermParams).filter(([key]) => key !== field),
    )
    const newText = searchParamsToText(newParams)
    setSearchTermText(newText)
    triggerSearch(newParams)
  }

  if (!hasSearchParams) return null

  return (
    <div className="flex flex-row space-x-2">
      {displayText}
      {generalSearch &&
        generalSearch.map(t => (
          <Pill key={t} text={t} onClick={() => handleRemoveGeneralSearch(t)} />
        ))}
      by:
      {restOfSearch &&
        Object.entries(restOfSearch).map(([k, v]) => (
          <Pill
            key={k}
            text={`${k}: ${v}`}
            onClick={() => handleRemoveTerm(k)}
          />
        ))}
      {tags &&
        tags.map(t => (
          <Pill key={t} text={`tag: ${t}`} onClick={() => handleRemoveTag(t)} />
        ))}
    </div>
  )
}
