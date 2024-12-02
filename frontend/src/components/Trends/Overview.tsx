import { useEffect, useState } from "react"
import balance from "../../utils/api"
import { useAppSelector } from "../../app/hooks"
import { ApiError } from "../../utils/classes/ApiError"
import { ApiTypes } from "../../types/api"

type OverviewResponse = ApiTypes.Trend.OverviewResponse
interface Props {}

export const Overview: React.FC<Props> = props => {
  const [data, setData] = useState<OverviewResponse | null>(null)
  const [errors, setErrors] = useState({})
  const curMonth = useAppSelector(state => state.session.settings.curMonth)
  useEffect(() => {
    const getData = async () => {
      try {
        const data = await balance.trend.overview({ startMonth: curMonth })
        console.log(data)
        return data
      } catch (e) {
        if (e instanceof ApiError) {
          setErrors(e)
        }
      }
    }
    getData().then(r => {
      if (r) {
        setData(r)
      }
    })
  }, [curMonth])
  if (!data) {
    return <div>Loading data</div>
  }

  return (
    <div>
      <h1>Month overview</h1>

      <div>This is how your spending tracked this month</div>
      <div>You spent {data.total.outgoing} this month.</div>
    </div>
  )
}
