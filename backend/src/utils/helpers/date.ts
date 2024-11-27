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
