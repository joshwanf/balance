"use client"

import { DetailedHTMLProps, InputHTMLAttributes, useState } from "react"

interface Props extends DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> {
  name: string
  displayText?: string
}
export const FormField = ({
  name,
  displayText,
  placeholder,
  defaultValue,
  ...rest
}: Props) => {
  const [value, setValue] = useState(defaultValue || "")

  return (
    <label htmlFor={name} className="grid grid-cols-[30%_70%] items-center">
      <div className="mr-2 justify-self-end">{displayText}</div>
      <input
        className="bg-transparent py-0.5 pl-2 
        justify-self-start
        border-2 border-grass-300 rounded-md 
        hover:border-grass-400
        focus:ring-0 focus:outline-none focus:border-grass-700
        placeholder:italic placeholder:text-grass-500"
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={e => setValue(e.target.value)}
        id={name}
        {...rest}
      />
    </label>
  )
}
