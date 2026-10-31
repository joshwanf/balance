import type { Column } from "@/components/Table/layout"

/** Transactions table columns, shared with its loading skeleton */
export const TRANSACTION_COLUMNS: Column[] = [
  { label: "", width: "w-10", checkbox: true },
  { label: "Date", width: "w-28" },
  { label: "Payee" },
  { label: "Account", width: "w-[22%]" },
  { label: "Amount", width: "w-32", align: "right" },
  { label: "Category", width: "w-[18%]" },
]

export const TRANSACTIONS_MIN_WIDTH = "min-w-[40rem]"
