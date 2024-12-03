interface Props {
  field: string
  displayText?: string
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}
export const FormField: React.FC<Props> = props => {
  const { field, displayText, placeholder, value, onChange, ...rest } = props
  return (
    <label htmlFor={field} className="grid grid-cols-[30%_70%]">
      <div className="mr-2 justify-self-end">{displayText}</div>
      <input
        className="bg-transparent py-0.5 pl-2 
        justify-self-start
        border-2 border-grass-300 rounded-md 
        hover:border-grass-400
        focus:ring-0 focus:outline-none focus:border-grass-700
        placeholder:italic placeholder:text-grass-500"
        name={field}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...rest}
      />
    </label>
  )
}
