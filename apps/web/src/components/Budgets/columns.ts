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

export const CATEGORIES_MIN_WIDTH = "min-w-[38rem]"
