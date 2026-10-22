export const cleanName = (input: string) => {
  const firstCharRegex = /^[^a-zA-Z]/g
  const symbolRegex = /[^a-zA-Z0-9]/g
  return input
    .replace(firstCharRegex, "")
    .replace(symbolRegex, "-")
    .toLowerCase()
  // if (typeof input === "string") {
  //   const regex = /[^a-zA-Z\-]/g
  //   return input.replace(/[^a-zA-Z\-]/g, "").toLowerCase()
  // } else if (input === undefined) {
  //   return input
  // } else {
  //   const absurd = (input: never) => input
  //   return absurd(input)
  // }
}
