interface Props {
  text: string
  onChange: (newText: string) => void
  additionalClasses?: string[]
  [key: string]: any
}
export const TextArea: React.FC<Props> = props => {
  const { text, onChange, additionalClasses, ...rest } = props
  const defaultClasses = [
    // default style
    "px-3",
    "py-2",
    // "mx-1",
    "border",
    "border-slate-400",
    "rounded-lg",
    "w-full",
    "box-border",
    // hover
    "hover:border-slate-600",
  ]
  const unifiedClassNames = [
    ...defaultClasses,
    ...(additionalClasses || []),
  ].join(" ")
  return (
    <textarea
      className={unifiedClassNames}
      value={text}
      onChange={e => onChange(e.target.value)}
      {...rest}
    />
  )
}
