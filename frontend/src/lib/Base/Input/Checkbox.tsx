interface Props {
  text: string
  id: string
  checked: boolean
  onChange: (input: boolean) => void
  isDisabled?: boolean
  additionalClasses?: string[]
  [key: string]: any
}
export const Checkbox: React.FC<Props> = props => {
  const { text, id, checked, onChange, additionalClasses, ...rest } = props
  return (
    <div>
      <input
        type="checkbox"
        id={id}
        name={id}
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        {...rest}
      />
      <label htmlFor={id}>{text}</label>
    </div>
  )
}
