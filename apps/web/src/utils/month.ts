import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
dayjs.extend(customParseFormat)

export const MONTH_PARAM = "month"
export const SEARCH_PARAM = "q"
export const OVERVIEW_RANGE_PARAM = "range"
export const OVERVIEW_RANGES = ["1", "3", "6"]
export const COMPARE_MONTH1_PARAM = "compareMonth1"
export const COMPARE_MONTH2_PARAM = "compareMonth2"

export const currentMonth = () => dayjs().format("YYYY-MM")

/** The ?month= value when it is a real YYYY-MM month, else the current month. */
export const monthFromSearchParams = (value: string | null | undefined) =>
  value && dayjs(value, "YYYY-MM", true).isValid() ? value : currentMonth()

export const rangeFromSearchParams = (value: string | null | undefined) => {
  const valueStr = value ?? "1"
  return OVERVIEW_RANGES.includes(valueStr) ? parseInt(valueStr, 10) : 1
}

export const compareMonthsFromSearchParams = (
  monthParam: string,
  month1: string | null | undefined,
  month2: string | null | undefined,
) => {
  if (!month1 && !month2) {
    return {
      month1: dayjs(monthFromSearchParams(monthParam))
        .subtract(1, "month")
        .format("YYYY-MM"),
      month2: monthFromSearchParams(monthParam),
    }
  }

  const cleanedMonth1 = monthFromSearchParams(month1)
  const cleanedMonth2 = monthFromSearchParams(month2)
  return {
    month1: cleanedMonth1,
    month2: cleanedMonth2,
  }
}

/** Adds ?month= to an app path so the selected month survives navigation. */
export const withMonth = (path: string, month: string) =>
  month === currentMonth() ? path : `${path}?${MONTH_PARAM}=${month}`

/** A page's awaited searchParams, as Next passes them */
export type PageSearchParams = Record<string, string | string[] | undefined>

/** One query value from a page's searchParams (the first, if repeated). */
export const pageParam = (params: PageSearchParams, key: string) => {
  const value = params[key]
  return Array.isArray(value) ? value[0] : value
}
