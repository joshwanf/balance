import { useState } from "react"
interface Props {
  text: string
  onTextChange: (newValue: string) => void
  additionalClasses?: string[]
  [key: string]: any
}
export const EditableText = (props: Props) => {
  const { text, onTextChange, additionalClasses, ...rest } = props
  const [value, setValue] = useState(text)

  const handleBlur = () => {
    const isChanged = text !== value
    if (isChanged) {
      console.log("Change in input after clicking off! Sending request", {
        old: text,
        new: value,
      })
      onTextChange(value)
    }
  }
  const defaultClasses = [
    // default style
    // "px-3",
    // "py-2",
    "border-2",
    // "rounded-lg",
    // "w-full",
    // hover
    "hover:border-slate-600",
    "focus:outline-none",
  ]
  const unifiedClassNames = [
    ...defaultClasses,
    ...(additionalClasses || []),
  ].join(" ")
  return (
    <input
      className={unifiedClassNames}
      value={value}
      onChange={e => setValue(e.target.value)}
      onBlur={handleBlur}
      {...rest}
    />
  )
}
