import { TableSkeleton } from "@/components/Skeletons/TableSkeleton"
import {
  CATEGORY_COLUMNS,
  CATEGORIES_MIN_WIDTH,
  CATEGORY_ROW_HEIGHT,
} from "./columns"

/** CategoryTable's loading state, including its phone select-all bar. */
export const CategoryTableSkeleton = () => (
  <div>
    <div className="md:hidden flex h-10 items-center gap-3 border-b-2 px-2">
      <input type="checkbox" aria-label="Select all" disabled />
      <span className="text-sm text-slate-500">Select all</span>
    </div>
    <TableSkeleton
      columns={CATEGORY_COLUMNS}
      minWidth={CATEGORIES_MIN_WIDTH}
      rows={8}
      stacked
      stackedRowHeight={CATEGORY_ROW_HEIGHT}
    />
  </div>
)
