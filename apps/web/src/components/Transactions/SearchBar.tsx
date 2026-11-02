"use client"
import { Search } from "lucide-react"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { PrimaryButton } from "../../lib/Base/Button"
import { useSetSearchText } from "../../hooks/useUrlState"

interface Props {
  searchText: string
}

/** Search box; submitting writes the text to ?q= and the list reloads. */
export const SearchBar = ({ searchText }: Props) => {
  const setSearchText = useSetSearchText()
  const [text, setText] = useState(searchText)
  const fieldRef = useRef<HTMLTextAreaElement>(null)

  // A one-row textarea that grows, so a long search wraps onto more lines
  // instead of running behind the search button
  useLayoutEffect(() => {
    const field = fieldRef.current
    if (!field) return
    field.style.height = "auto"
    field.style.height = `${field.scrollHeight}px`
  }, [text])

  useEffect(() => {
    setText(searchText)
  }, [searchText])

  const handleSearch = () => setSearchText(text.trim())

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSearch()
    }
  }
  return (
    <div
      className="flex items-start gap-1 w-full
    border-2 border-brand-300 rounded-lg py-2 px-2
    focus-within:border-brand-600
    text-brand-700"
    >
      <Search className="mt-0.5 shrink-0" />
      <textarea
        ref={fieldRef}
        name="search"
        rows={1}
        value={text}
        onChange={e => setText(e.target.value.replace(/\n/g, " "))}
        className="w-full min-w-0 resize-none overflow-hidden bg-transparent leading-6 focus:outline-none
        placeholder:italic"
        placeholder="Search..."
        onKeyDown={handleKeyDown}
      />
      <PrimaryButton onClick={handleSearch} additionalClasses={["shrink-0"]}>
        search
      </PrimaryButton>
    </div>
  )
}
