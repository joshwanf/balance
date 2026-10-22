import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
dayjs.extend(customParseFormat)

/** parse date from YYYY-MM-DD */
export const parseDate = (date: string): { month: string; year: string } => {
  const isValidStr = date.match(/[\d]{4}-[\d]{2}-[\d]{2}/)
  if (!isValidStr) {
    throw "Invalid date string!"
  }

  const dateObj = dayjs(date, "YYYY-MM-DD")
  return {
    month: (dateObj.month() + 1).toString(),
    year: dateObj.year().toString(),
  }
}

export const getNextMonth = (date: string): string => {
  const curMonth = dayjs(date, "YYYY-MM", true)
  const nextMonth = curMonth.add(1, "month")
  return nextMonth.format("YYYY-MM")
}

export const getNthMonth = (date: string, n: number): string => {
  const curMonth = dayjs(date, "YYYY-MM")
  const nthMonth = curMonth.add(n, "month")
  return nthMonth.format("YYYY-MM")
}

export const diffMonths = (startMonth: string, endMonth: string): number => {
  const start = dayjs(startMonth, "YYYY-MM")
  const end = dayjs(endMonth, "YYYY-MM")
  return end.diff(start, "month")
}

interface ValidateDateInput {
  date: string
  format?: string
}
export const validateDate = (input: ValidateDateInput) => {
  const date = input.date
  const format = input.format || "YYYY-MM-DD"

  const dayObj = dayjs(date, format, true)
  const isValidDate = dayObj.isValid()
  if (!isValidDate) {
    return false
  }

  // need dayjs.extend(isSameOrAfter)
  // const isAfter1970 = dayObj.isSameOrAfter("1970-01-01")
  // if (!isAfter1970) {
  //   return false
  // }

  const returnedDate = dayObj.format(format)
  return returnedDate === date
}
