import React, { useEffect, useRef, useState } from "react"

interface Props {
  field: string
  options: { id: string | number; name: string }[]
  displayText?: string
  disableBlankSelection?: boolean
  selected: string
  onChange: (id: any) => void
  labelId?: string
}
export const DropdownSelector: React.FC<Props> = props => {
  const {
    field,
    options,
    displayText,
    disableBlankSelection,
    selected,
    onChange,
    labelId,
    ...rest
  } = props

  const [showOpts, setShowOpts] = useState(false)
  const divRef = useRef(null)

  const gridCols = displayText ? "grid-cols-[30%_70%]" : "grid-cols-1"
  const gridColSpan = displayText ? "col-span-1" : "col-span-1"
  return (
    // <div className="inline-block hover:cursor-pointer">
    <label htmlFor={field} className={`grid ${gridCols}`}>
      {displayText && (
        <div className="mr-2 justify-self-end text-bold">{displayText}</div>
      )}
      <div
        className={`w-full flex flex-row justify-around justify-self-start bg-gray-100 border-2 rounded-lg hover:border-gray-300`}
      >
        <select
          className="w-full bg-transparent text-gray-900 px-2 py-0.5 appearance-none hover:cursor-pointer focus:ring-0 focus-visible:outline-none"
          value={selected}
          onChange={e => onChange(e.target.value)}
          id={field}
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
            className="px-2 w-8 border-l-2 rounded-r-sm border-l-slate-300 hover:bg-gray-200 hover:rounded-r-md"
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
