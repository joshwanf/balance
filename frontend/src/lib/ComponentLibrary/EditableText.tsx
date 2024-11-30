import { useRef, useState } from "react"
interface Props {
  text: string
  editText: (newText: string) => void
  // onTextChange: (newValue: string) => void
  additionalClasses?: string[]
  [key: string]: any
}
export const EditableText = (props: Props) => {
  const { text, editText, onTextChange, additionalClasses, ...rest } = props
  const originalText = text
  const [value, setValue] = useState<string>(text)
  const divRef = useRef<HTMLDivElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.stopPropagation()
    if (e.key === "Enter") {
      e.preventDefault()
      if (divRef && divRef.current) {
        divRef.current.blur()
      }
    }
  }
  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    e.stopPropagation()
    if (text !== e.currentTarget.innerText) {
      editText(e.currentTarget.textContent || "")
    }
  }

  const defaultClasses = [
    // default style
    // "border-2",
    "hover:border-slate-600",
    "focus:outline-none",
  ]
  const unifiedClassNames = [
    ...defaultClasses,
    ...(additionalClasses || []),
  ].join(" ")
  return (
    <div className="inline-block">
      <div
        ref={divRef}
        contentEditable={true}
        suppressContentEditableWarning={true}
        className={unifiedClassNames}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {text}
      </div>
    </div>
  )
}
