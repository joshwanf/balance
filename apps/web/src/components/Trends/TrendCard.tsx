"use client"
import Link from "next/link"

interface Props {
  title: string
  to: string
}

export const TrendCard = ({ title, to, ...rest }: Props) => {
  return (
    <Link
      className="flex items-center justify-center border-2 rounded-lg w-40 h-40"
      href={to}
    >
      {title}
    </Link>
  )
}
