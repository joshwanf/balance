import { TableSkeleton } from "@/components/Skeletons/TableSkeleton"

export default function Loading() {
  return <TableSkeleton rows={10} cols={5} />
}
