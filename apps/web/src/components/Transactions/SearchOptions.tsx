"use client"
import { Pill } from "../../lib/Base/Pill/Pill"
import { QueryParams, searchParamsToText } from "../../utils/searchHelpers"
import { useSetSearchText } from "../../hooks/useUrlState"

interface Props {
  searchTermParams: Partial<QueryParams>
}

/** Pills for the active search; removing one rewrites ?q= without it. */
export const SearchOptions = ({ searchTermParams }: Props) => {
  const setSearchText = useSetSearchText()
  const hasSearchParams = Object.keys(searchTermParams).length > 0

  const { generalSearch, tags, ...restOfSearch } = searchTermParams
  const displayText =
    generalSearch && generalSearch.length > 0 ? "Searching for " : "Searching "

  const search = (params: Partial<QueryParams>) =>
    setSearchText(searchParamsToText(params))

  const handleRemoveGeneralSearch = (term: string) => {
    const newTerms = generalSearch?.filter(t => t !== term) || []
    search({ ...searchTermParams, generalSearch: newTerms })
  }

  const handleRemoveTag = (tag: string) => {
    if (tags) {
      search({ ...searchTermParams, tags: tags.filter(t => t !== tag) })
    }
  }

  const handleRemoveTerm = (field: keyof QueryParams) => {
    search(
      Object.fromEntries(
        Object.entries(searchTermParams).filter(([key]) => key !== field),
      ),
    )
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
