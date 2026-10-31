import { TableSkeleton } from "@/components/Skeletons/TableSkeleton"
import { TransactionsToolbar } from "@/components/Transactions/TransactionsToolbar"
import {
  TRANSACTION_COLUMNS,
  TRANSACTIONS_MIN_WIDTH,
} from "@/components/Transactions/columns"

// Same toolbar and table geometry as the page, so nothing moves when it arrives
export default function Loading() {
  return (
    <div>
      <TransactionsToolbar />
      <TableSkeleton
        columns={TRANSACTION_COLUMNS}
        minWidth={TRANSACTIONS_MIN_WIDTH}
      />
    </div>
  )
}
