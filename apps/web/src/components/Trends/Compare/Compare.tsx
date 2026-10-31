import { getSessionUser } from "@/server/auth"
import { trendCompare } from "@/server/data"
import { CompareChart } from "./CompareChart"
import dayjs from "dayjs"

/** Layout of the two charts, shared with the loading skeleton */
export const COMPARE_GRID_CLASS =
  "mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2"

/** Chart.js's default colours, plus a few more so up to 12 categories differ */
const PALETTE = [
  "rgb(54, 162, 235)",
  "rgb(255, 99, 132)",
  "rgb(255, 159, 64)",
  "rgb(255, 205, 86)",
  "rgb(75, 192, 192)",
  "rgb(153, 102, 255)",
  "rgb(201, 203, 207)",
  "rgb(46, 139, 87)",
  "rgb(140, 86, 75)",
  "rgb(23, 190, 207)",
  "rgb(227, 119, 194)",
  "rgb(107, 110, 207)",
]

interface Props {
  month1: string
  month2: string
}

export const Compare = async ({ month1, month2 }: Props) => {
  const user = await getSessionUser()
  if (!user) return null

  const data = await trendCompare(user.id, month1, month2)
  // one colour per category across both charts, so they can be compared
  const names = [
    ...new Set(data.flatMap(d => d.summary.map(s => s.name))),
  ].sort()
  const colors = Object.fromEntries(
    names.map((n, i) => [n, PALETTE[i % PALETTE.length]]),
  )

  return (
    // stacked on phones, side by side from md
    <div className={COMPARE_GRID_CLASS}>
      <div className="w-full">
        <div className="text-center font-bold">
          {dayjs(month1).format("MMMM YYYY")}
        </div>
        <CompareChart data={data[0]} colors={colors} />
      </div>
      <div className="w-full">
        <div className="text-center font-bold">
          {dayjs(month2).format("MMMM YYYY")}
        </div>
        <CompareChart data={data[1]} colors={colors} />
      </div>
    </div>
  )
}
