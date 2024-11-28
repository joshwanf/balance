import { useState } from "react"
import { Checkbox } from "./Checkbox"

interface CheckboxOption {
  text: string
  checked?: boolean
  isDisabled?: boolean
}
interface Props {
  options: CheckboxOption[]
  selected: boolean[]
  onChange: (input: boolean[]) => void
  additionalClasses?: string[]
  [key: string]: any
}
export const ManyCheckboxes: React.FC<Props> = props => {
  const { options, selected, onChange, additionalClasses, ...rest } = props
  const isDisabled = options.map(option => option.isDisabled ?? false)
  const handleChangeCheckbox = (i: number) => (checked: boolean) => {
    const before = selected.slice(0, i)
    const after = selected.slice(i + 1)
    onChange([...before, checked, ...after])
  }
  return (
    <div>
      {options.map((option, i) => (
        <Checkbox
          key={i}
          text={option.text}
          id={option.text}
          checked={selected[i]}
          disabled={isDisabled[i]}
          onChange={handleChangeCheckbox(i)}
        />
      ))}
    </div>
  )
}
