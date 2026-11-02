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
  "rounded-lg border-2 border-brand-300 bg-surface px-2 py-1 focus:border-brand-600 focus:outline-none"

export const CompareMonthSelector = ({
  compareMonth1,
  compareMonth2,
  month,
}: Props) => {
  return (
    // wraps onto more lines on narrow screens instead of overflowing
    <form className="flex flex-wrap items-end gap-3 rounded-2xl bg-brand-100 p-4">
      <input type="hidden" readOnly name={MONTH_PARAM} value={month} />

      <label className="flex flex-col gap-1 text-sm font-semibold text-brand-800">
        Month 1
        <input
          type="month"
          name={COMPARE_MONTH1_PARAM}
          defaultValue={compareMonth1}
          className={INPUT_CLASS}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-semibold text-brand-800">
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
        className="rounded-lg border-2 border-brand-700 bg-brand-700 px-4 py-1 text-brand-100 hover:bg-brand-800"
      >
        Compare
      </button>
    </form>
  )
}
