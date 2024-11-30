import React, { useEffect, useRef, useState } from "react"

interface Props {
  field: string
  options: { id: string | number; name: string }[]
  displayText?: string
  disableBlankSelection?: boolean
  selected: string
  onChange: (id: any) => void
}
export const DropdownSelector: React.FC<Props> = props => {
  const {
    field,
    options,
    displayText,
    disableBlankSelection,
    selected,
    onChange,
    ...rest
  } = props

  const [showOpts, setShowOpts] = useState(false)
  const divRef = useRef(null)

  return (
    // <div className="inline-block hover:cursor-pointer">
    <label htmlFor={field} className="flex">
      <div className="mr-2 lg:hidden w-24 text-right text-bold">
        {displayText}
      </div>
      <div className="inline-block bg-gray-100 border-2 rounded-lg hover:border-gray-300 focus-within:ring-red-500 focus:border-blue-500 ">
        <select
          className="bg-transparent text-gray-900 px-2 py-0.5 appearance-none hover:cursor-pointer focus:ring-0 focus-visible:outline-none"
          value={selected}
          onChange={e => onChange(e.target.value)}
        >
          <option value="" disabled={disableBlankSelection}>
            Choose an option
          </option>
          {options.map(option => (
            <option
              key={option.id}
              value={option.id}
              className="p-2 hover:bg-grass-200"
            >
              {option.name}
            </option>
          ))}
        </select>
        {!disableBlankSelection && (
          <button
            className="px-2 border-l-2 rounded-r-sm border-l-slate-300 hover:bg-gray-200 hover:rounded-r-md"
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
