import type { ApiTypes } from "@balance/api-types"
import { pfetch, readJson, toApiError, toQuery } from "."

type OverviewReq = {
  startMonth: string
  endMonth: string
}
type OverviewRes = ApiTypes.Trend.OverviewResponse
interface Overview {
  (overviewInput: OverviewReq): Promise<OverviewRes>
}
const overview: Overview = async input => {
  const url = `/api/trends/overview${toQuery({ ...input })}`
  const res = await pfetch(url, "GET")
  if (!res.ok) {
    throw await toApiError(res)
  }
  return await readJson(res)
}

type CompareRequest = ApiTypes.Trend.CompareRequest
type CompareResponse = ApiTypes.Trend.CompareResponse
type Compare = (months: CompareRequest) => Promise<CompareResponse>

const compare: Compare = async months => {
  const url = `/api/trends/compare${toQuery({ ...months })}`
  const res = await pfetch(url, "GET")
  if (!res.ok) {
    throw await toApiError(res)
  }
  return await readJson(res)
}
export default { overview, compare }
