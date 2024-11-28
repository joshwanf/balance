import React, { useEffect, useRef, useState } from "react"

interface Props {
  options: {
    id: string | number
    name: string
  }[]
  disableBlankSelection?: boolean
  selected: string
  onChange: (id: any) => void
}
export const DropdownSelector: React.FC<Props> = props => {
  const { options, disableBlankSelection, selected, onChange, ...rest } = props

  const [showOpts, setShowOpts] = useState(false)
  const divRef = useRef(null)

  return (
    // <div className="inline-block hover:cursor-pointer">
    <div className="inline-block bg-gray-100 border-2 rounded-lg hover:border-gray-300 focus-within:ring-red-500 focus:border-blue-500 ">
      <select
        className="bg-transparent text-gray-900 text-sm px-2 appearance-none hover:cursor-pointer focus:ring-0 focus-visible:outline-none"
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
            className="p-2 hover:bg-blue-200"
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
    // </div>
  )
}
