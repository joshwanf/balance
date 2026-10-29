import { TableSkeleton } from "@/components/Skeletons/TableSkeleton"

export default function Loading() {
  return <TableSkeleton rows={8} cols={4} />
}
