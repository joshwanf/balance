import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRef, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { setCurMonth } from "../../features/sessionSlice"
import { listTransactionsThunk } from "../../utils/thunks/transactions"
import { DatePicker } from "./DatePicker"
import dayjs from "dayjs"
import { Popover } from "../../lib/ComponentLibrary/Popover/Popover"

interface Props {}
export const MonthNavigator: React.FC<Props> = props => {
  const dispatch = useAppDispatch()
  const dateRef = useRef<HTMLDivElement>(null)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const curMonth = useAppSelector(state => state.session.settings.curMonth)

  const changeCurMonth = (by: number) => () => {
    const newMonth = dayjs(curMonth, "YYYY-MM")
      .add(by, "month")
      .format("YYYY-MM")
    dispatch(setCurMonth(newMonth))
    dispatch(listTransactionsThunk({ startMonth: newMonth }))
  }
  const setNewMonth = (toMonth: string) => {
    dispatch(setCurMonth(toMonth))
    dispatch(listTransactionsThunk({ startMonth: toMonth }))
  }
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
