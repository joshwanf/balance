import { TableSkeleton } from "@/components/Skeletons/TableSkeleton"
import {
  CATEGORY_COLUMNS,
  CATEGORIES_MIN_WIDTH,
} from "@/components/Budgets/columns"

export default function Loading() {
  return (
    <TableSkeleton
      columns={CATEGORY_COLUMNS}
      minWidth={CATEGORIES_MIN_WIDTH}
      rows={8}
    />
  )
}
