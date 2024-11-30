// import "./ListSelector.css"

interface Props {
  inputValue: string
  list: string[]
  addToSelected: (item: string) => void
  [key: string]: any
}
export const ListSelector = (props: Props) => {
  const { inputValue, list, addToSelected, ...rest } = props
  return list.map(item => (
    <div
      className={`list-selector ${
        inputValue && item === inputValue ? "list-selector-highlight" : ""
      }`}
      key={item}
      onClick={() => addToSelected(item)}
      {...rest}
    >
      {item}
    </div>
  ))
}
