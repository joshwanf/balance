interface Props {
  type?: string
  text: string
  onChange: (input: string) => void
  additionalClasses?: string[]
  [key: string]: any
}
export const TextInput = (props: Props) => {
  const { text, onChange, type, additionalClasses, ...rest } = props
  const defaultClasses = [
    // default style
    "px-3",
    "py-1",
    "border",
    "border-slate-400",
    "rounded-lg",
    "w-full",
    // hover
    "hover:border-slate-600",
  ]
  const unifiedClassNames = [
    ...defaultClasses,
    ...(additionalClasses || []),
  ].join(" ")
  return (
    <label>
      <input
        className={unifiedClassNames}
        value={text}
        type={type || "text"}
        onChange={e => onChange(e.target.value)}
        {...rest}
      />
    </label>
  )
}
