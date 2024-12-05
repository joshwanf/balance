import { useState } from "react"
import { DatePicker } from "../../Main/DatePicker"
import dayjs from "dayjs"
import { DateOptions } from "../../Main/DateOptions"
import { PrimaryButton } from "../../../lib/Base/Button"
import { ApiTypes } from "../../../types/api"
import balance from "../../../utils/api"
import { ApiError } from "../../../utils/classes/ApiError"
import { validateDate } from "../../../utils/helpers/date"
import { Errors } from "../../../lib/ComponentLibrary/Errors"
import { CompareChart } from "./CompareChart"

type PieChart = ApiTypes.Trend.PieChart
type CompareErrors = { year1?: string; year2?: string; api?: string }
interface Props {}

export const Compare: React.FC<Props> = props => {
  const curMonth = dayjs().format("MM")
  const curYear = dayjs().format("YYYY")
  const [month1, setMonth1] = useState(curMonth)
  const [year1, setYear1] = useState(curYear)
  const [month2, setMonth2] = useState(curMonth)
  const [year2, setYear2] = useState(curYear)
  const [data, setData] = useState<PieChart[]>([])
  const [errors, setErrors] = useState<CompareErrors>({})

  const isDataLoaded = data.length === 2

  const handleCompareMonths = async () => {
    const isYear1Valid = validateDate({ date: year1, format: "YYYY" })
    const isYear2Valid = validateDate({ date: year2, format: "YYYY" })
    const invalidYearErrorMsg = "Please enter a valid year (YYYY)"
    const accErrors: CompareErrors = {}
    if (!isYear1Valid) {
      accErrors.year1 = invalidYearErrorMsg
    }
    if (!isYear2Valid) {
      accErrors.year2 = invalidYearErrorMsg
    }
    setErrors(accErrors)

    if (isYear1Valid && isYear2Valid) {
      const res = await balance.trend.compare({
        month1: `${year1}-${month1}`,
        month2: `${year2}-${month2}`,
      })
      if (res instanceof ApiError) {
        setErrors({ api: res.err.message })
      }
      setData(res)
    }
  }

  return (
    <div>
      Compare
      <div className="self-center">
        <PrimaryButton onClick={handleCompareMonths}>Compare</PrimaryButton>
      </div>
      <div className="flex">
        <div className="w-1/2 p-4">
          <div className="text-center font-bold">Month 1</div>
          <DateOptions
            monthOpts={[month1, setMonth1]}
            yearOpts={[year1, setYear1]}
          />
          {errors.year1 && <Errors errors={errors.year1} />}
          {isDataLoaded && (
            <div className="w-full">
              <CompareChart data={data[0]} />
            </div>
          )}
        </div>
        <div className="w-1/2 p-4">
          <div className="text-center font-bold">Month 1</div>
          <DateOptions
            monthOpts={[month2, setMonth2]}
            yearOpts={[year2, setYear2]}
          />
          {errors.year2 && <Errors errors={errors.year2} />}
          {isDataLoaded && (
            <div className="w-full">
              <CompareChart data={data[1]} />
            </div>
          )}
        </div>
      </div>
      <div>Compare chart</div>
    </div>
  )
}
