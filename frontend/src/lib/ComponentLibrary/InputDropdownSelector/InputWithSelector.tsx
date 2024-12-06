import { useRef, useState } from "react"
import TextInput from "../../Base/TextInput/TextInput"
import { Pill } from "../../Base/Pill/Pill"

import "./InputWithSelector.css"
import { ListSelectorForwardRef } from "../../Base/ListSelector/ListSelectorForwardRef"

interface Props {
  list: string[]
  selected: string[]
  setSelected: (selected: string[]) => void
}
export const InputWithSelector = (props: Props) => {
  const { list, selected, setSelected, ...rest } = props
  const tagRef = useRef<HTMLDivElement>(null)
  const [text, setText] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const [isPendingBackspace, setIsPendingBackspace] = useState(false)

  const lowercaseSelected = selected.map(s => s.toLowerCase())
  const availableList = list.filter(
    item => !lowercaseSelected.includes(item.toLowerCase()),
  )
  const displayList = availableList.filter(item =>
    item.toLowerCase().includes(text.toLowerCase()),
  )

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

  const handleCloseMenu = (input: boolean) => {
    setIsPendingBackspace(false)
    setShowDropdown(input)
  }

  return (
    <div
      ref={tagRef}
      className=" border-2 border-grass-300 py-2 px-2 rounded-lg w-5/6"
    >
      <div
        className={`flex flex-wrap gap-2 backspace-pending-${isPendingBackspace}`}
      >
        {selected.map(item => (
          <Pill
            key={item}
            text={item}
            onClick={() => removeItemFromSelected(item)}
          />
        ))}
        <div className="flex flex-row w-full justify-between">
          <TextInput
            text={text}
            onChange={setText}
            placeholder="Add tag"
            className="tag-selector-input"
            onClick={() => setShowDropdown(true)}
            onKeyDown={handleKeyDown}
          />
          {showDropdown && (
            <button onClick={() => handleCloseMenu(false)}>close</button>
          )}
        </div>
      </div>
      <div id="tagSelectorNode"></div>
      {showDropdown && (
        <ListSelectorForwardRef
          inputValue={text}
          list={displayList}
          addToSelected={addItemToSelected}
          closeMenu={handleCloseMenu}
        />
      )}
    </div>
  )
}
