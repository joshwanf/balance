import Link from "next/link"
import type { LucideIcon } from "lucide-react"

interface Props {
  title: string
  description: string
  to: string
  Icon: LucideIcon
}

export const TrendCard = ({ title, description, to, Icon }: Props) => {
  return (
    <Link
      className="flex items-center gap-4 rounded-xl border-2 border-grass-200 px-5 py-4 text-grass-700
        hover:border-grass-400 hover:text-grass-900 hover:shadow-lg hover:shadow-grass-500
        focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-grass-400
        motion-safe:transition-shadow"
      href={to}
    >
      <Icon className="size-8 shrink-0" />
      <span>
        <span className="block text-lg font-semibold">{title}</span>
        <span className="block text-sm text-slate-500">{description}</span>
      </span>
    </Link>
  )
}
