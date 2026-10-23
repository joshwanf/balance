"use client"
import Link from "next/link"
import { useCurMonth } from "../../hooks/useUrlState"
import { withMonth } from "../../utils/month"

interface Props {
  title: string
  to: string
}

export const TrendCard = ({ title, to, ...rest }: Props) => {
  const curMonth = useCurMonth()
  return (
    <Link
      className="flex items-center justify-center border-2 rounded-lg w-40 h-40"
      href={withMonth(to, curMonth)}
    >
      {title}
    </Link>
  )
}
