import { forwardRef, useEffect, useRef } from "react"
import "./ListSelector.css"

interface Props {
  inputValue: string
  list: string[]
  addToSelected: (item: string) => void
  closeMenu: (input: boolean) => void
  [key: string]: any
}
export const ListSelectorForwardRef: React.FC<Props> = props => {
  const { inputValue, list, addToSelected, closeMenu, ...rest } = props as Props
  const listRef = useRef<HTMLDivElement>(null)
  const handleClick = (item: string) => (e: React.MouseEvent) => {
    e.stopPropagation()
    addToSelected(item)
  }

  // const handleClickOutside = (e: MouseEvent) => {
  //   console.log("click outside")
  //   if (listRef.current && !listRef.current.contains(e.target as Node)) {
  //     closeMenu(false)
  //   }
  // }

  // useEffect(() => {
  //   console.log("in use effect")
  //   if (listRef.current) {
  //     console.log("listref", listRef.current)
  //     listRef.current.addEventListener("click", handleClickOutside)
  //   }

  //   return () => {
  //     if (listRef.current) {
  //       listRef.current.removeEventListener("click", handleClickOutside)
  //     }
  //   }
  // }, [handleClickOutside])

  return (
    <div ref={listRef} className="w-full relative">
      <div className="tag-list">
        {list.map(item => (
          <div
            className={`list-selector ${
              inputValue && item === inputValue ? "list-selector-highlight" : ""
            }`}
            key={item}
            onClick={handleClick(item)}
            {...rest}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}
// export const ListSelectorForwardRef = forwardRef<HTMLDivElement, Props>(
//   (props, ref) => {
//     const { inputValue, list, addToSelected, ...rest } = props as Props
//     const handleClick = (item: string) => (e: React.MouseEvent) => {
//       e.stopPropagation()
//       addToSelected(item)
//     }
//     return (
//       <div ref={ref} onClick={e => e.stopPropagation()}>
//         {list.map(item => (
//           <div
//             className={`list-selector ${
//               inputValue && item === inputValue ? "list-selector-highlight" : ""
//             }`}
//             key={item}
//             // onClick={() => addToSelected(item)}
//             onClick={handleClick(item)}
//             {...rest}
//           >
//             {item}
//           </div>
//         ))}
//       </div>
//     )
//   },
// )
