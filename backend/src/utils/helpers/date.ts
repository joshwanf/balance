import moment from "moment"

/** parse date from YYYY-MM-DD */
export const parseDate = (date: string): { month: string; year: string } => {
  const isValidStr = date.match(/[\d]{4}-[\d]{2}-[\d]{2}/)
  if (!isValidStr) {
    throw "Invalid date string!"
  }

  const dateObj = moment(date, "YYYY-MM-DD")
  return {
    month: (dateObj.month() + 1).toString(),
    year: dateObj.year().toString(),
  }
}

export const getNextMonth = (date: string): string => {
  const curMonth = moment(date, "YYYY-MM")
  const nextMonth = curMonth.add(1, "month")
  return nextMonth.format("YYYY-MM")
}

export const getNthMonth = (date: string, n: number): string => {
  const curMonth = moment(date, "YYYY-MM")
  const nthMonth = curMonth.add(n, "month")
  return nthMonth.format("YYYY-MM")
}

export const diffMonths = (startMonth: string, endMonth: string): number => {
  const start = moment(startMonth, "YYYY-MM")
  const end = moment(endMonth, "YYYY-MM")
  return moment(end).diff(moment(start), "months")
}

interface ValidateDateInput {
  date: string
  format?: string
}
export const validateDate = (input: ValidateDateInput) => {
  const date = input.date
  const format = input.format || "YYYY-MM-DD"

  const momentObj = moment(date, format, true)
  const isValidDate = momentObj.isValid()
  if (!isValidDate) {
    return false
  }

  const isAfter1970 = momentObj.isSameOrAfter("1970-01-01")
  if (!isAfter1970) {
    return false
  }

  const returnedDate = momentObj.format(format)
  return returnedDate === date
}
