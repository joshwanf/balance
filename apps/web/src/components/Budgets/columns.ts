import type { Column } from "@/components/Table/layout"

/** Budgets table columns, shared with its loading skeleton */
export const CATEGORY_COLUMNS: Column[] = [
  // wide enough for the checkbox and the row's saving spinner
  { label: "", width: "w-14", checkbox: true },
  { label: "Category name" },
  { label: "Budgeted amount", width: "w-44" },
  { label: "Used amount", width: "w-40", align: "right" },
  { label: "Available amount", width: "w-40", align: "right" },
]

// rows stack below md, so the min width only applies from md up
export const CATEGORIES_MIN_WIDTH = "md:min-w-[38rem]"

/** Stacked (phone) row height: name line plus the editable budget line */
export const CATEGORY_ROW_HEIGHT = "max-md:h-20"
