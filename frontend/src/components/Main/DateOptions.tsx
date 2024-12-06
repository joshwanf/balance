import { useState } from "react"
import { TextInput } from "../../lib/Base/Input"
import { DropdownSelector } from "../../lib/ComponentLibrary/DropdownSelector"
import dayjs from "dayjs"

interface Props {
  monthOpts: [string, (month: string) => void]
  yearOpts: [string, (year: string) => void]
}

export const DateOptions: React.FC<Props> = props => {
  const { monthOpts, yearOpts, ...rest } = props
  const [month, setMonth] = monthOpts
  const [year, setYear] = yearOpts

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
  return (
    <>
      <div>
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
      </div>
    </>
  )
}
