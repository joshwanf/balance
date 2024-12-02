import { useEffect, useState } from "react"
import balance from "../../../utils/api"
import { useAppSelector } from "../../../app/hooks"
import { ApiError } from "../../../utils/classes/ApiError"
import { ApiTypes } from "../../../types/api"
import { Money } from "../../../utils/classes/Money"
import { OverviewChart } from "./OverviewChart"
import moment from "moment"
import { Link } from "react-router"
import { MonthRangeSelector } from "./MonthRangeSelector"

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
    startMonth: moment().format("YYYY-MM"),
    endMonth: moment().add(1, "month").format("YYYY-MM"),
  })

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
        const { total, categories } = r
        const sortedOutgoing = [...categories]
          .sort((a, b) => {
            if (a.outgoing < b.outgoing) {
              return -1
            } else if (a.outgoing > b.outgoing) {
              return 1
            } else {
              return a.id < b.id ? -1 : 1
            }
          })
          .map(c => ({
            ...c,
            outgoing: Money.fromCents(c.outgoing.toString()).dollars,
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
    outgoing: Money.fromCents(data.total.outgoing.toString()),
    incoming: Money.fromCents(data.total.incoming.toString()),
  }

  return (
    <div>
      <div>
        <Link to="../">Trends</Link> &gt; <Link to="">Overview</Link>
      </div>
      <MonthRangeSelector setSelectedRange={setSelectedRange} />
      <h1 className="font-bold">
        {moment(curMonth, "YYYY-MM").format("MMMM YYYY")} Overview
      </h1>

      <div>
        You spent {total.outgoing.format()} and brought in{" "}
        {total.incoming.format()} over the past {selectedRange.diff}{" "}
        {selectedRange.diff === 1 ? "month" : "months"}.
      </div>
      <div className="w-1/2">
        <OverviewChart categories={outgoing} />
      </div>
    </div>
  )
}
