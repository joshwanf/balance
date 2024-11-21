export const cleanName = (input: string | undefined): string | undefined => {
  if (typeof input === "string") {
    const regex = /[^a-zA-Z\-]/g
    return input.replace(/[^a-zA-Z\-]/g, "").toLowerCase()
  } else if (input === undefined) {
    return input
  } else {
    const absurd = (input: never) => input
    return absurd(input)
  }
}
