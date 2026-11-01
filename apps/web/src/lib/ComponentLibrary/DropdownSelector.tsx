"use client"
import { useRef, useState } from "react"

interface Props {
  field: string
  options: { id: string | number; name: string }[]
  displayText?: string
  disableBlankSelection?: boolean
  selected: string
  onChange: (id: any) => void
  labelId?: string
  name?: string
}
export const DropdownSelector = ({
  field,
  options,
  displayText,
  disableBlankSelection,
  selected,
  onChange,
  labelId,
  name,
  ...rest
}: Props) => {
  const [showOpts, setShowOpts] = useState(false)
  const divRef = useRef(null)

  // with a label: above the select on phones, beside it from sm
  const gridCols = displayText
    ? "grid-cols-1 gap-1 sm:grid-cols-[30%_70%] sm:gap-0"
    : "grid-cols-1"
  const gridColSpan = displayText ? "col-span-1" : "col-span-1"
  return (
    // <div className="inline-block hover:cursor-pointer">
    <label htmlFor={field} className={`grid ${gridCols}`}>
      {displayText && (
        <div className="sm:mr-2 sm:justify-self-end text-bold">
          {displayText}
        </div>
      )}
      <div
        className={`w-full flex flex-row justify-around justify-self-start bg-neutral-100 border-2 rounded-lg hover:border-neutral-300`}
      >
        <select
          className="w-full bg-transparent text-neutral-900 px-2 py-0.5 appearance-none hover:cursor-pointer focus:ring-0 focus-visible:outline-none"
          value={selected}
          onChange={e => onChange(e.target.value)}
          id={field}
          name={name}
        >
          <option value="" disabled={disableBlankSelection}>
            Choose an option
          </option>
          {options.map(option => (
            <option
              key={option.id}
              value={option.id}
              className="p-2 hover:bg-brand-200"
            >
              {option.name}
            </option>
          ))}
        </select>
        {!disableBlankSelection && (
          <button
            type="button"
            className="px-2 w-8 border-l-2 rounded-r-sm border-l-neutral-300 hover:bg-neutral-200 hover:rounded-r-md"
            onClick={() => onChange("")}
          >
            &times;
          </button>
        )}
      </div>
    </label>
    // </div>
  )
}
