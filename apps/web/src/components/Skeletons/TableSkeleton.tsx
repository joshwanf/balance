import { TableHead } from "@/components/Table/TableHead"
import {
  type Column,
  ROW_CLASS,
  STACKED,
  TABLE_CLASS,
  TABLE_WRAPPER_CLASS,
} from "@/components/Table/layout"

interface Props {
  /** the real table's columns, so the skeleton has the same geometry */
  columns: Column[]
  /** min-width class of the real table */
  minWidth?: string
  rows?: number
  /** the real table stacks its rows below md; match its two-line rows */
  stacked?: boolean
  /** height class of the real table's stacked rows */
  stackedRowHeight?: string
}

/** Grey placeholder rows in the real table's layout, shown while it loads. */
export const TableSkeleton = ({
  columns,
  minWidth = "",
  rows = 10,
  stacked,
  stackedRowHeight = STACKED.rowHeight,
}: Props) => {
  const st = (cls: string) => (stacked ? cls : "")
  return (
    <div className={TABLE_WRAPPER_CLASS} aria-busy="true" aria-label="Loading">
      <table className={`${TABLE_CLASS} ${minWidth} ${st(STACKED.table)}`}>
        <TableHead columns={columns} stacked={stacked} />
        <tbody className={`animate-pulse ${st(STACKED.body)}`}>
          {Array.from({ length: rows }, (_, r) => (
            <tr
              key={r}
              className={`${ROW_CLASS} ${st(`${STACKED.row} ${stackedRowHeight} max-md:px-2`)}`}
            >
              {stacked && (
                <td className="space-y-2 md:hidden">
                  <div className="h-4 w-2/3 rounded bg-grass-100" />
                  <div className="h-3 w-1/2 rounded bg-grass-100" />
                </td>
              )}
              {columns.map((col, c) => (
                <td
                  key={c}
                  className={`${col.checkbox ? "pl-2" : "pr-4"} ${st("max-md:hidden")}`}
                >
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
