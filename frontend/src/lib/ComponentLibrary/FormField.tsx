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
    <label htmlFor={field} className="flex">
      <div className="mr-2 lg:hidden w-24 text-right">{displayText}</div>
      <input
        className="bg-transparent py-0.5 pl-2 
        border-2 border-grass-300 rounded-md 
        hover:border-grass-400
        focus:ring-0 focus:outline-none focus:border-grass-700
        placeholder:italic placeholder:text-grass-500"
        name={field}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </label>
  )
}
