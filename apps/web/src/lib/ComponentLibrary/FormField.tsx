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
    // label above the input on phones, beside it from sm
    <label
      htmlFor={name}
      className="grid grid-cols-1 gap-1 sm:grid-cols-[30%_70%] sm:gap-0 items-center"
    >
      <div className="sm:mr-2 sm:justify-self-end">{displayText}</div>
      <input
        className="w-full sm:w-auto bg-transparent py-0.5 pl-2 
        justify-self-start
        border-2 border-brand-300 rounded-md 
        hover:border-brand-400
        focus:ring-0 focus:outline-none focus:border-brand-700
        placeholder:italic placeholder:text-brand-500"
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
