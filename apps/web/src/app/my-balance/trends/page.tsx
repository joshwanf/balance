import { TrendsList } from "@/components/Trends/TrendsList"
import {
  MONTH_PARAM,
  monthFromSearchParams,
  pageParam,
  PageSearchParams,
} from "@/utils/month"

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<PageSearchParams>
}) {
  const params = await searchParams
  const month = monthFromSearchParams(pageParam(params, MONTH_PARAM))

  return <TrendsList month={month} />
}
