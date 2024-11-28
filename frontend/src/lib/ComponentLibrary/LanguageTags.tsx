import { useState } from "react"
import { InputWithSelector } from "../lib/InputDropdownSelector/InputWithSelector"

export const LanguageTags = () => {
  const arr = [
    "aws",
    "express",
    "haskell",
    "javascript",
    "flask",
    "python",
    "react",
  ]
  const [selected, setSelected] = useState<string[]>([])

  return (
    <div>
      <InputWithSelector
        list={arr}
        selected={selected}
        setSelected={setSelected}
      />
    </div>
  )
}
