import { getSessionUser } from "@/server/auth"
import { trendCompare } from "@/server/data"
import { CompareChart } from "./CompareChart"
import dayjs from "dayjs"

interface Props {
  month1: string
  month2: string
}

export const Compare = async ({ month1, month2 }: Props) => {
  const user = await getSessionUser()
  if (!user) return null

  const data = await trendCompare(user.id, month1, month2)

  return (
    <div className="flex gap-8 w-full">
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
