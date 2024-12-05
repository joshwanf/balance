import { useState } from "react"
import { diffMonths, getNthMonth } from "../../../utils/helpers/date"
import dayjs from "dayjs"

interface Range {
  title: string
  startMonth: string
  endMonth: string
  diff: any
}
interface Props {
  //   range: number
  setSelectedRange: (range: Range) => void
}
export const MonthRangeSelector: React.FC<Props> = props => {
  const { setSelectedRange, ...rest } = props

  const [range, setRange] = useState(0)

  const handleChangeRange =
    (index: number) => (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      setRange(index)
      setSelectedRange(rangeOptions[index])
    }

  const thisMonth = dayjs().format("YYYY-MM")
  const nextMonth = getNthMonth(thisMonth, 1)
  const threeMonthsAgo = getNthMonth(nextMonth, -3)
  const sixMonthsAgo = getNthMonth(nextMonth, -6)

  const rangeOptions: Range[] = [
    {
      title: "1M",
      startMonth: thisMonth,
      endMonth: nextMonth,
      diff: diffMonths(thisMonth, nextMonth),
    },
    {
      title: "3M",
      startMonth: threeMonthsAgo,
      endMonth: nextMonth,
      diff: diffMonths(threeMonthsAgo, nextMonth),
    },
    {
      title: "6M",
      startMonth: sixMonthsAgo,
      endMonth: nextMonth,
      diff: diffMonths(sixMonthsAgo, nextMonth),
    },
  ]

  return (
    <div>
      {rangeOptions.map((option, i) => (
        <button
          key={i}
          className={`w-10 border-b-2 ${range === i ? "border-b-red-500" : ""}`}
          onClick={handleChangeRange(i)}
        >
          {option.title}
        </button>
      ))}
    </div>
  )
}
