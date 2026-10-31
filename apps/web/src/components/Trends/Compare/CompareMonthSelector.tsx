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

const INPUT_CLASS =
  "rounded-lg border-2 border-grass-300 bg-white px-2 py-1 focus:border-grass-600 focus:outline-none"

export const CompareMonthSelector = ({
  compareMonth1,
  compareMonth2,
  month,
}: Props) => {
  return (
    // wraps onto more lines on narrow screens instead of overflowing
    <form className="flex flex-wrap items-end gap-3 rounded-2xl bg-grass-100 p-4">
      <input type="hidden" readOnly name={MONTH_PARAM} value={month} />

      <label className="flex flex-col gap-1 text-sm font-semibold text-grass-800">
        Month 1
        <input
          type="month"
          name={COMPARE_MONTH1_PARAM}
          defaultValue={compareMonth1}
          className={INPUT_CLASS}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-semibold text-grass-800">
        Month 2
        <input
          type="month"
          name={COMPARE_MONTH2_PARAM}
          defaultValue={compareMonth2}
          className={INPUT_CLASS}
        />
      </label>

      <button
        type="submit"
        className="rounded-lg border-2 border-grass-700 bg-grass-700 px-4 py-1 text-grass-100 hover:bg-grass-800"
      >
        Compare
      </button>
    </form>
  )
}
