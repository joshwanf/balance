type Prefixes = "normal" | "hover" | "active"
interface Styles {
  /** Each property takes in a color string */
  color: string
  bg: string
  border: string
}
type StateSchema = Record<Prefixes, Styles>
export const makeTwClassNames = (schema: StateSchema): string[] => {
  /** Returns an array of Tailwind CSS utility class names given a schema */
  const states = Object.entries(schema)
  const classNames = []
  for (const [state, styles] of states) {
    const prefix = state !== "normal" ? state + ":" : ""
    for (const [prop, style] of Object.entries(styles)) {
      classNames.push(`${prefix}${prop}-${style}`)
    }
  }
  return classNames
}
