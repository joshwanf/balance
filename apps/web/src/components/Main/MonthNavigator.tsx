"use client"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRef, useState } from "react"
import { useCurMonth, useSetMonth } from "../../hooks/useUrlState"
import { DatePicker } from "./DatePicker"
import dayjs from "dayjs"
import { Popover } from "../../lib/ComponentLibrary/Popover/Popover"

interface Props {}
export const MonthNavigator = ({}: Props) => {
  const dateRef = useRef<HTMLDivElement>(null)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const curMonth = useCurMonth()
  const setMonth = useSetMonth()

  const changeCurMonth = (by: number) => () => {
    const newMonth = dayjs(curMonth, "YYYY-MM")
      .add(by, "month")
      .format("YYYY-MM")
    setMonth(newMonth)
  }
  const setNewMonth = (toMonth: string) => setMonth(toMonth)
  return (
    <div className="py-4 flex space-x-1">
      <button onClick={changeCurMonth(-1)}>
        <ChevronLeft />
      </button>
      <div
        onClick={() => setShowDatePicker(!showDatePicker)}
        className="relative hover:cursor-pointer"
      >
        <div ref={dateRef} className="text-center w-24">
          {dayjs(curMonth).format("MMMM")}
          <br />
          {dayjs(curMonth).format("YYYY")}
        </div>
        {showDatePicker && (
          <Popover
            callerRef={dateRef}
            closePopover={() => setShowDatePicker(false)}
            selector="#authNode"
            positionStyle="belowLeftAligned"
          >
            <DatePicker
              onChange={setNewMonth}
              closeMenu={() => setShowDatePicker(false)}
            />
          </Popover>
        )}
      </div>
      <button onClick={changeCurMonth(1)}>
        <ChevronRight />
      </button>
    </div>
  )
}
