import { useEffect, useState } from "react"
import balance from "../../../utils/api"
import { useAppSelector } from "../../../app/hooks"
import { ApiError } from "../../../utils/classes/ApiError"
import type { ApiTypes } from "../../../types/api"
import { Money } from "../../../utils/classes/Money"
import { OverviewChart } from "./OverviewChart"
import { Link } from "react-router"
import { MonthRangeSelector } from "./MonthRangeSelector"
import { diffMonths } from "../../../utils/helpers/date"
import dayjs from "dayjs"

type OverviewResponse = ApiTypes.Trend.OverviewResponse
interface Props {}

export const Overview: React.FC<Props> = props => {
  const [data, setData] = useState<OverviewResponse | null>(null)
  const [outgoing, setOutgoing] = useState<
    OverviewResponse["categories"] | null
  >(null)
  const [errors, setErrors] = useState({})
  const curMonth = useAppSelector(state => state.session.settings.curMonth)

  const [selectedRange, setSelectedRange] = useState({
    diff: 1,
    startMonth: dayjs().format("YYYY-MM"),
    endMonth: dayjs().add(1, "month").format("YYYY-MM"),
  })
  const numMonths = diffMonths(selectedRange.startMonth, selectedRange.endMonth)
  const months: string[] = []
  const starting = dayjs(selectedRange.startMonth, "YYYY-MM", true)
  for (let i = 0; i < numMonths; i++) {
    months.push(starting.add(i, "month").format("YYYY-MM"))
  }

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await balance.trend.overview({
          startMonth: selectedRange.startMonth,
          endMonth: selectedRange.endMonth,
        })
        return data
      } catch (e) {
        if (e instanceof ApiError) {
          setErrors(e)
        }
      }
    }
    getData().then(r => {
      if (r) {
        const { summary, categories } = r
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
        setData(r)
        setOutgoing(sortedOutgoing)
      }
    })
  }, [selectedRange])

  if (!data) {
    return <div>Loading data</div>
  }

  const total = {
    outgoing: Money.fromCents(data.summary.total.outgoing.toString()),
    incoming: Money.fromCents(data.summary.total.incoming.toString()),
  }

  return (
    <div>
      <div>
        <Link to="../">Trends</Link> &gt; <Link to="">Overview</Link>
      </div>

      <MonthRangeSelector setSelectedRange={setSelectedRange} />

      <div>
        You spent {total.outgoing.format()} and brought in{" "}
        {total.incoming.format()} over the past {selectedRange.diff}{" "}
        {selectedRange.diff === 1 ? "month" : "months"}.
      </div>
      <div className="w-1/2">
        <OverviewChart categories={outgoing} labels={months} />
      </div>
    </div>
  )
}
