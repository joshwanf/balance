/**
 * Shared geometry for the data tables and their loading skeletons. A table and
 * its skeleton render from the same column list and row class, so swapping one
 * for the other changes only the cell contents, never the layout.
 *
 * Plain module (no "use client") so server files like loading.tsx can read it.
 */

export interface Column {
  /** header text; empty for the select-all checkbox column */
  label: string
  /** width class for the <col>, e.g. "w-28"; omit to share the leftover width */
  width?: string
  align?: "right"
  /** the select-all checkbox column */
  checkbox?: boolean
}

/** Fixed layout, so column widths come from the <col>s and not from the data */
export const TABLE_CLASS = "w-full table-fixed border-collapse"

/** Below this the columns stop shrinking and the table scrolls inside its wrapper */
export const TABLE_WRAPPER_CLASS = "overflow-x-auto"

/** Every body row is this tall, real or skeleton */
export const ROW_CLASS = "h-12 border-b-2"

export const HEADER_CELL_CLASS = "h-10 py-2 font-semibold"

export const alignClass = (col: Column) =>
  col.align === "right" ? "text-right pr-4" : "text-left"
