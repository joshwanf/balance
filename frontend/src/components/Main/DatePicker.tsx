import { useState } from "react"
import { useAppSelector } from "../../app/hooks"
import { TextInput } from "../../lib/Base/Input"
import * as Btn from "../../lib/Base/Button"
import { DropdownSelector } from "../../lib/ComponentLibrary/DropdownSelector"
import moment from "moment"
import { validateDate } from "../../utils/helpers/date"

interface Props {
  onChange: (toMonth: string) => void
  closeMenu: () => void
}

export const DatePicker: React.FC<Props> = props => {
  const { onChange, closeMenu } = props
  const curMonth = moment().format("MM")
  const curYear = moment().format("YYYY")

  const [month, setMonth] = useState(curMonth)
  const [year, setYear] = useState(curYear)
  const [error, setError] = useState("")
  const months = [
    { id: "01", name: "January", value: "01" },
    { id: "02", name: "February", value: "02" },
    { id: "03", name: "March", value: "03" },
    { id: "04", name: "April", value: "04" },
    { id: "05", name: "May", value: "05" },
    { id: "06", name: "June", value: "06" },
    { id: "07", name: "July", value: "07" },
    { id: "08", name: "August", value: "08" },
    { id: "09", name: "September", value: "09" },
    { id: "10", name: "October", value: "10" },
    { id: "11", name: "November", value: "11" },
    { id: "12", name: "December", value: "12" },
  ]

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
      className="absolute bg-grass-100 border-2 border-grass-300 w-48 space-y-2 p-2 rounded-lg"
      onClick={e => e.stopPropagation()}
    >
      <div>
        {/* <select className="mx-1 rounded-md">
          {months.map((month, i) => (
            <option key={i}>{month.name}</option>
          ))}
        </select> */}
        <DropdownSelector
          field="month"
          disableBlankSelection={true}
          selected={month}
          options={months}
          onChange={setMonth}
        />
      </div>
      <div>
        <TextInput
          text={year}
          onChange={setYear}
          placeholder="Year (YYYY)"
          additionalClasses={["lg:w-24"]}
          type="number"
        />
        {error && <div>{error}</div>}
      </div>
      <Btn.PrimaryButton onClick={handleClick}>Go to month</Btn.PrimaryButton>
    </div>
  )
}
