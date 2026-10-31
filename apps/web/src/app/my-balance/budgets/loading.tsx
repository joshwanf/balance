import { CategoriesToolbar } from "@/components/Budgets/CategoriesToolbar"
import { CategoryTableSkeleton } from "@/components/Budgets/CategoryTableSkeleton"

// Same toolbar and table geometry as the page, so nothing moves when it arrives
export default function Loading() {
  return (
    <div>
      <CategoriesToolbar />
      <CategoryTableSkeleton />
    </div>
  )
}
