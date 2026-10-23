"use client"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import {
  MONTH_PARAM,
  SEARCH_PARAM,
  currentMonth,
  monthFromSearchParams,
} from "../utils/month"

/** The selected month from ?month=, defaulting to the current month. */
export const useCurMonth = () =>
  monthFromSearchParams(useSearchParams().get(MONTH_PARAM))

/** The transaction search text from ?q=, or "" when not searching. */
export const useSearchText = () => useSearchParams().get(SEARCH_PARAM) ?? ""

/** Returns a setter that writes one query param, keeping the others. */
const useSetParam = (key: string, isDefault: (value: string) => boolean) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  return useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (!value || isDefault(value)) params.delete(key)
      else params.set(key, value)
      const query = params.toString()
      router.push(query ? `${pathname}?${query}` : pathname)
    },
    [router, pathname, searchParams, key, isDefault],
  )
}

const isCurrentMonth = (month: string) => month === currentMonth()
const never = () => false

export const useSetMonth = () => useSetParam(MONTH_PARAM, isCurrentMonth)
export const useSetSearchText = () => useSetParam(SEARCH_PARAM, never)
