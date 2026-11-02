import { CategoriesToolbar } from "@/components/Budgets/CategoriesToolbar"
import { CategoryTableSkeleton } from "@/components/Budgets/CategoryTableSkeleton"
import { MonthTotalsSkeleton } from "@/components/Budgets/MonthTotals"

// Same toolbar and table geometry as the page, so nothing moves when it arrives
export default function Loading() {
  return (
    <div>
      <CategoriesToolbar totals={<MonthTotalsSkeleton />} />
      <CategoryTableSkeleton />
    </div>
  )
}
