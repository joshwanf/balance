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

/** 1M / 3M / 6M segmented control; each option is a link to that range. */
export const MonthRangeSelector = ({ currentQuery, curRange }: Props) => {
  return (
    <nav
      aria-label="Range"
      className="inline-flex rounded-lg bg-grass-100 p-1 text-sm"
    >
      {OVERVIEW_RANGES.map(range => {
        const isCurrent = `${curRange}` === range
        return (
          <Link
            key={range}
            href={{ query: { ...currentQuery, [OVERVIEW_RANGE_PARAM]: range } }}
            aria-current={isCurrent ? "page" : undefined}
            className={`rounded-md px-3 py-1 ${
              isCurrent
                ? "bg-white font-semibold text-grass-900 shadow-sm"
                : "text-grass-700 hover:text-grass-900"
            }`}
          >
            {`${range}M`}
          </Link>
        )
      })}
    </nav>
  )
}
