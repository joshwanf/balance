import { useState } from "react"
import TextInput from "../Base/TextInput/TextInput"
import { ListSelector } from "../Base/ListSelector/ListSelector"
import { Pill } from "../Base/Pill/Pill"

// import "./InputWithSelector.css"

interface Props {
  list: string[]
  selected: string[]
  setSelected: (selected: string[]) => void
}
export const InputWithSelector = (props: Props) => {
  const { list, selected, setSelected, ...rest } = props

  const [text, setText] = useState("")
  const [showDropdown, setShowDropdown] = useState(true)
  const [isPendingBackspace, setIsPendingBackspace] = useState(false)

  const availableList = list.filter(item => !selected.includes(item))
  const displayList = availableList.filter(item => item.includes(text))

  const addItemToSelected = (item: string) => {
    setSelected([...selected, item])
    setIsPendingBackspace(false)
  }
  const removeItemFromSelected = (item: string) => {
    const nextSelected = selected.filter(s => s !== item)
    setSelected([...nextSelected])
    setIsPendingBackspace(false)
  }
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value.length > 0) {
      e.preventDefault()
      const newItem = e.currentTarget.value

      const isNewItemInSelected = selected.includes(newItem)
      const isNewItemInDisplayList = displayList.includes(newItem)
      if (!isNewItemInSelected) {
        setSelected([...selected, newItem])
      }
      setText("")
    } else if (e.key === "Backspace" && e.currentTarget.value.length === 0) {
      if (!isPendingBackspace) {
        setIsPendingBackspace(true)
      } else {
        const nextSelectedItems = selected.slice(0, -1)
        setSelected([...nextSelectedItems])
        setIsPendingBackspace(false)
      }
    } else {
      if (isPendingBackspace) {
        setIsPendingBackspace(false)
      }
    }
  }
  return (
    <div className="input-with-selector">
      <div className={`backspace-pending-${isPendingBackspace}`}>
        {selected.map(item => (
          <Pill
            key={item}
            text={item}
            onClick={() => removeItemFromSelected(item)}
          />
        ))}
        <TextInput
          text={text}
          onChange={setText}
          placeholder="Add tag"
          // className="text-input"
          onFocus={() => setShowDropdown(true)}
          // onBlur={() => setShowDropdown(false)}
          onKeyDown={handleKeyDown}
        />
      </div>
      {showDropdown && (
        <ListSelector
          inputValue={text}
          list={displayList}
          addToSelected={addItemToSelected}
          //   className="asdf"
        />
      )}
    </div>
  )
}
