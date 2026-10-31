import { TableHead } from "@/components/Table/TableHead"
import {
  type Column,
  ROW_CLASS,
  TABLE_CLASS,
  TABLE_WRAPPER_CLASS,
} from "@/components/Table/layout"

interface Props {
  /** the real table's columns, so the skeleton has the same geometry */
  columns: Column[]
  /** min-width class of the real table */
  minWidth?: string
  rows?: number
}

/** Grey placeholder rows in the real table's layout, shown while it loads. */
export const TableSkeleton = ({ columns, minWidth = "", rows = 10 }: Props) => {
  return (
    <div className={TABLE_WRAPPER_CLASS} aria-busy="true" aria-label="Loading">
      <table className={`${TABLE_CLASS} ${minWidth}`}>
        <TableHead columns={columns} />
        <tbody className="animate-pulse">
          {Array.from({ length: rows }, (_, r) => (
            <tr key={r} className={ROW_CLASS}>
              {columns.map((col, c) => (
                <td key={c} className={col.checkbox ? "pl-2" : "pr-4"}>
                  <div
                    className={`h-4 rounded bg-grass-100 ${col.checkbox ? "w-4" : "w-3/4"} ${col.align === "right" ? "ml-auto" : ""}`}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
