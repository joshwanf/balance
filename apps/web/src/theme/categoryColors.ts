// The 12 category hues. Light and dark values live in tailwind.tokens.js
// (cat.*) and reach the page as --cat-<key> CSS variables. The order here is
// the order new categories take them in: neighbours differ as much as
// possible, so a handful of categories never look alike.
export const CATEGORY_COLORS = [
  "green",
  "blue",
  "orange",
  "violet",
  "teal",
  "red",
  "amber",
  "indigo",
  "pink",
  "olive",
  "brown",
  "slate",
] as const

export type CategoryColor = (typeof CATEGORY_COLORS)[number]

export const isCategoryColor = (c: unknown): c is CategoryColor =>
  typeof c === "string" && (CATEGORY_COLORS as readonly string[]).includes(c)

/**
 * The hue for a new category: the one the user's categories use least, first
 * in palette order on a tie. So 2 categories get 2 hues, 12 get all 12, and
 * with 20 no hue is used more than twice.
 */
export const leastUsedColor = (used: (string | null)[]): CategoryColor => {
  const counts = new Map<string, number>(CATEGORY_COLORS.map(c => [c, 0]))
  for (const c of used)
    if (c && counts.has(c)) counts.set(c, counts.get(c)! + 1)
  let best: CategoryColor = CATEGORY_COLORS[0]
  for (const c of CATEGORY_COLORS)
    if (counts.get(c)! < counts.get(best)!) best = c
  return best
}

/** A category's hue, or a stable one from its id when it has none saved */
export const categoryColor = (c: {
  id: string
  color?: string | null
}): CategoryColor => {
  if (isCategoryColor(c.color)) return c.color
  let h = 0
  for (const ch of c.id) h = (h * 31 + ch.charCodeAt(0)) | 0
  return CATEGORY_COLORS[Math.abs(h) % CATEGORY_COLORS.length]
}

/** For style={{ ... }}: the CSS variable holding a hue as "r g b" */
export const categoryColorVar = (c: CategoryColor) => `var(--cat-${c})`

/** A hue as a colour string for canvas (charts), read from the current theme */
export const categoryColorValue = (c: CategoryColor, fallback = "#888") => {
  if (typeof window === "undefined") return fallback
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue(`--cat-${c}`)
    .trim()
  return v ? `rgb(${v})` : fallback
}
