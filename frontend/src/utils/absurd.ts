export const absurd = <A>(_: never): A => {
  throw new Error("This function should never be called")
}

export const assertNever = (x: never): never => {
  return absurd(x)
}
