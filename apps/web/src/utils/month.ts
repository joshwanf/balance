import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
dayjs.extend(customParseFormat)

export const MONTH_PARAM = "month"
export const SEARCH_PARAM = "q"

export const currentMonth = () => dayjs().format("YYYY-MM")

/** The ?month= value when it is a real YYYY-MM month, else the current month. */
export const monthFromSearchParams = (value: string | null | undefined) =>
  value && dayjs(value, "YYYY-MM", true).isValid() ? value : currentMonth()

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
