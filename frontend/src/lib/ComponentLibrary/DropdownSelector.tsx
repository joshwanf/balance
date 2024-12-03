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

  const gridColSpan = displayText ? "col-span-1" : "col-span-2"
  return (
    // <div className="inline-block hover:cursor-pointer">
    <label htmlFor={field} className="grid grid-cols-[30%_70%]">
      {displayText && (
        <div className="mr-2 justify-self-end text-bold">{displayText}</div>
      )}
      <div
        className={`${gridColSpan} justify-self-start bg-gray-100 border-2 rounded-lg hover:border-gray-300 focus-within:ring-red-500 focus:border-blue-500`}
      >
        <select
          className="bg-transparent text-gray-900 px-2 py-0.5 appearance-none hover:cursor-pointer focus:ring-0 focus-visible:outline-none"
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
