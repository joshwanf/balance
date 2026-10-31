"use client"
import { useState } from "react"
import { PrimaryButton } from "../../lib/Base/Button"
import { validateDate } from "../../utils/helpers/date"
import dayjs from "dayjs"
import { DateOptions } from "./DateOptions"

interface Props {
  onChange: (toMonth: string) => void
  closeMenu: () => void
}

export const DatePicker = ({ onChange, closeMenu }: Props) => {
  const curMonth = dayjs().format("MM")
  const curYear = dayjs().format("YYYY")

  const [month, setMonth] = useState(curMonth)
  const [year, setYear] = useState(curYear)
  const [error, setError] = useState("")

  const handleClick = () => {
    const newMonth = `${year}-${month}`
    const isValidDate = validateDate({ date: newMonth, format: "YYYY-MM" })

    if (!isValidDate) {
      setError("Please enter a year from 1970 or later (YYYY)")
    } else {
      onChange(newMonth)
      closeMenu()
    }
  }
  return (
    <div
      className="bg-grass-100 border-2 border-grass-300 w-48 space-y-2 p-2 rounded-lg"
      onClick={e => e.stopPropagation()}
    >
      <DateOptions monthOpts={[month, setMonth]} yearOpts={[year, setYear]} />
      {error && <div>{error}</div>}
      <PrimaryButton onClick={handleClick}>Go to month</PrimaryButton>
    </div>
  )
}
