import { Money } from "@/utils/classes/Money"
import { OverviewChart } from "./OverviewChart"
import dayjs from "dayjs"
import { getSessionUser } from "@/server/auth"
import { getNthMonth } from "@/server/utils/date"
import { trendOverview } from "@/server/data"
/** Height of the chart area, shared with the loading skeleton */
export const OVERVIEW_CHART_CLASS = "relative h-80 sm:h-96"

interface Props {
  month: string
  range: number
}

export const Overview = async ({ month, range }: Props) => {
  const user = await getSessionUser()
  if (!user) return null

  const startMonth = getNthMonth(month, -1 * range + 1)
  const endMonth = getNthMonth(month, 1)
  const data = await trendOverview(user.id, startMonth, endMonth)

  const {
    summary: {
      total: { outgoing, incoming },
    },
    categories,
  } = data

  const sortedOutgoing = [...categories]
    .sort((a, b) => {
      if (a.name < b.name) {
        return -1
      } else if (a.name > b.name) {
        return 1
      } else {
        return a.id < b.id ? -1 : 1
      }
    })
    .map(c => ({
      ...c,
      outgoing: c.outgoing.map(
        o => Money.fromCents(o?.toString() || "0").dollars,
      ),
      incoming: c.incoming.map(
        i => Money.fromCents(i?.toString() || "0").dollars,
      ),
    }))

  const starting = dayjs(month, "YYYY-MM", true)
  const months = Array.from({ length: range }, (_, i) =>
    starting.subtract(i, "month").format("YYYY-MM"),
  ).reverse()

  const total = {
    outgoing: Money.fromCents(outgoing.toString()),
    incoming: Money.fromCents(incoming.toString()),
  }

  return (
    <>
      <p>
        You spent{" "}
        <span className="font-semibold tabular-nums">
          {total.outgoing.format()}
        </span>{" "}
        and brought in{" "}
        <span className="font-semibold tabular-nums">
          {total.incoming.format()}
        </span>{" "}
        over the past {range} {range === 1 ? "month" : "months"}.
      </p>
      <div className={OVERVIEW_CHART_CLASS}>
        <OverviewChart categories={sortedOutgoing} labels={months} />
      </div>
    </>
  )
}
