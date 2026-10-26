import Link from "next/link"
import {
  OVERVIEW_RANGE_PARAM,
  OVERVIEW_RANGES,
  PageSearchParams,
} from "@/utils/month"

interface Props {
  currentQuery: PageSearchParams
  curRange: number
}
export const MonthRangeSelector = ({ currentQuery, curRange }: Props) => {
  return (
    <div>
      {OVERVIEW_RANGES.map(range => (
        <Link
          key={range}
          href={{ query: { ...currentQuery, [OVERVIEW_RANGE_PARAM]: range } }}
          className={`inline-block w-10 border-b-2 ${`${curRange}` === range ? "border-b-red-500" : ""}`}
        >
          {`${range}M`}
        </Link>
      ))}
    </div>
  )
}
