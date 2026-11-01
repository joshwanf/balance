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
      className="flex items-center gap-4 rounded-xl border-2 border-brand-200 px-5 py-4 text-brand-700
        hover:border-brand-400 hover:text-brand-900 hover:shadow-lg hover:shadow-brand-500
        focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-400
        motion-safe:transition-shadow"
      href={to}
    >
      <Icon className="size-8 shrink-0" />
      <span>
        <span className="block text-lg font-semibold">{title}</span>
        <span className="block text-sm text-neutral-500">{description}</span>
      </span>
    </Link>
  )
}
