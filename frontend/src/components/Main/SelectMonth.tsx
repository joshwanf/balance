import { ChevronLeft, ChevronRight } from "lucide-react"
import moment from "moment"
import { useState } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { setCurMonth } from "../../features/sessionSlice"
import { listTransactionsThunk } from "../../utils/thunks/transactions"
import { DatePicker } from "./DatePicker"

interface Props {}
export const SelectMonth: React.FC<Props> = props => {
  const dispatch = useAppDispatch()
  const [showDatePicker, setShowDatePicker] = useState(false)
  const curMonth = useAppSelector(state => state.session.settings.curMonth)

  const changeCurMonth = (by: number) => () => {
    const newMonth = moment(curMonth, "YYYY-MM")
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
        <div className="text-center w-24">
          {moment(curMonth).format("MMMM")}
          <br />
          {moment(curMonth).format("YYYY")}
        </div>
        {showDatePicker && (
          <DatePicker
            onChange={setNewMonth}
            closeMenu={() => setShowDatePicker(false)}
          />
        )}
      </div>
      <button onClick={changeCurMonth(1)}>
        <ChevronRight />
      </button>
    </div>
  )
}
