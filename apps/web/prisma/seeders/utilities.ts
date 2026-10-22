export const nextMonth = (startingMonth: string): string => {
  const matches = startingMonth.match(/^([0-9]{4})-([0-9]{2})$/)
  if (!matches) {
    throw new Error("startingMonth must be in YYYY-MM.")
  }

  const [_, year, month] = matches
  const nextMonth = parseInt(month, 10) === 12 ? 1 : parseInt(month, 10) + 1
  const nextYear = nextMonth === 1 ? parseInt(year, 10) + 1 : parseInt(year, 10)
  return `${nextYear}-${nextMonth.toString().padStart(2, "0")}`
}
