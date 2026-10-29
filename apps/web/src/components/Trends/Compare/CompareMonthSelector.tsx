import {
  COMPARE_MONTH1_PARAM,
  COMPARE_MONTH2_PARAM,
  MONTH_PARAM,
} from "@/utils/month"

interface Props {
  compareMonth1: string
  compareMonth2: string
  month: string
}

export const CompareMonthSelector = ({
  compareMonth1,
  compareMonth2,
  month,
}: Props) => {
  return (
    <form className="flex items-center gap-4">
      <input type="hidden" readOnly name={MONTH_PARAM} value={month} />

      <div className="flex items-center gap-2">
        Month 1
        <input
          type="month"
          name={COMPARE_MONTH1_PARAM}
          defaultValue={compareMonth1}
          className="border rounded-xl px-2"
        />
      </div>
      <div className="flex items-center gap-2">
        Month 2
        <input
          type="month"
          name={COMPARE_MONTH2_PARAM}
          defaultValue={compareMonth2}
          className="border rounded-xl px-2"
        />
      </div>

      <button type="submit">Compare</button>
    </form>
  )
}
