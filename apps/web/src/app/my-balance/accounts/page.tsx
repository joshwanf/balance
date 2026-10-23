import { Suspense } from "react"
import { AccountList } from "@/components/Accounts/AccountList"
import { CardGridSkeleton } from "@/components/Skeletons/CardGridSkeleton"
import {
  MONTH_PARAM,
  monthFromSearchParams,
  pageParam,
  type PageSearchParams,
} from "@/utils/month"

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<PageSearchParams>
}) {
  const month = monthFromSearchParams(
    pageParam(await searchParams, MONTH_PARAM),
  )
  return (
    <Suspense key={month} fallback={<CardGridSkeleton count={3} />}>
      <AccountList month={month} />
    </Suspense>
  )
}
