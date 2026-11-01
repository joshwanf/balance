import { getSessionUser } from "@/server/auth"
import { trendCompare } from "@/server/data"
import { CompareChart } from "./CompareChart"
import dayjs from "dayjs"

/** Layout of the two charts, shared with the loading skeleton */
export const COMPARE_GRID_CLASS =
  "mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2"

interface Props {
  month1: string
  month2: string
}

export const Compare = async ({ month1, month2 }: Props) => {
  const user = await getSessionUser()
  if (!user) return null

  const data = await trendCompare(user.id, month1, month2)
  return (
    // stacked on phones, side by side from md
    <div className={COMPARE_GRID_CLASS}>
      <div className="w-full">
        <div className="text-center font-bold">
          {dayjs(month1).format("MMMM YYYY")}
        </div>
        <CompareChart data={data[0]} />
      </div>
      <div className="w-full">
        <div className="text-center font-bold">
          {dayjs(month2).format("MMMM YYYY")}
        </div>
        <CompareChart data={data[1]} />
      </div>
    </div>
  )
}
