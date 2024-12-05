import { pfetch } from "."
import { ApiTypes } from "../../types/api"
import { ApiError } from "../classes/ApiError"

type OverviewReq = {
  startMonth: string
  endMonth: string
}
type OverviewRes = ApiTypes.Trend.OverviewResponse
interface Overview {
  (overviewInput: OverviewReq): Promise<OverviewRes>
}
const overview: Overview = async input => {
  // don't need to filter empty entries if endMonth is required
  // const params = Object.entries(input).filter(([k, v]) => v)
  const searchParams = new URLSearchParams(input).toString()
  const url = `/api/trend/overview${"?" + searchParams}`
  const res = await pfetch(url, input)
  if (!res.ok) {
    throw new ApiError(await res.json(), res.status)
  }

  return await res.json()
}

type CompareRequest = ApiTypes.Trend.CompareRequest
type CompareResponse = ApiTypes.Trend.CompareResponse
type Compare = (months: CompareRequest) => Promise<CompareResponse>

const compare: Compare = async months => {
  const url = "/api/trend/compare"
  const res = await pfetch(url, months)
  if (!res.ok) {
    throw new ApiError(await res.json(), res.status)
  }

  return await res.json()
}
export default { overview, compare }
