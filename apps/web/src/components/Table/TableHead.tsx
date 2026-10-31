import { type Column, HEADER_CELL_CLASS, STACKED, alignClass } from "./layout"

interface Props {
  columns: Column[]
  /** select-all checkbox state; the checkbox is disabled when omitted */
  allChecked?: boolean
  onCheckAll?: (e: React.ChangeEvent<HTMLInputElement>) => void
  /** hide the header below md, for tables whose rows stack there */
  stacked?: boolean
  /** shown in place of the column labels, same height, while rows are selected */
  selectionBar?: React.ReactNode
}

/** <colgroup> and header row for a data table or its skeleton. */
export const TableHead = ({
  columns,
  allChecked,
  onCheckAll,
  stacked,
  selectionBar,
}: Props) => (
  <>
    <colgroup>
      {columns.map((col, i) => (
        <col key={i} className={col.width} />
      ))}
    </colgroup>
    <thead className={stacked ? STACKED.head : undefined}>
      <tr>
        {columns.map((col, i) =>
          selectionBar && !col.checkbox ? (
            i === 1 && (
              <th
                key={i}
                colSpan={columns.length - 1}
                // no vertical padding so the bar's buttons fit the row height
                className="h-10 py-0 text-left"
              >
                {selectionBar}
              </th>
            )
          ) : (
            <th
              key={i}
              className={`${HEADER_CELL_CLASS} ${col.checkbox ? "pl-2 text-left" : alignClass(col)}`}
            >
              {col.checkbox ? (
                <input
                  type="checkbox"
                  aria-label="Select all"
                  checked={allChecked ?? false}
                  disabled={!onCheckAll}
                  readOnly={!onCheckAll}
                  onChange={onCheckAll}
                  // no handlers when disabled: the skeleton renders on the server
                  onClick={onCheckAll && (e => e.stopPropagation())}
                />
              ) : (
                col.label
              )}
            </th>
          ),
        )}
      </tr>
    </thead>
  </>
)
