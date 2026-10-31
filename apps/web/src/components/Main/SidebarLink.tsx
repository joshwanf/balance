"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { LucideIcon } from "lucide-react"
import { useCurMonth } from "../../hooks/useUrlState"
import { withMonth } from "../../utils/month"
import { isActivePath } from "./navLinks"

interface Props {
  to: string
  label: string
  Icon: LucideIcon
  /** only active on this exact path, not its children */
  end?: boolean
  /** icon only, with the label kept for screen readers and as a tooltip */
  collapsed?: boolean
  onNavigate?: () => void
}
export const SidebarLink = ({
  to,
  label,
  Icon,
  end,
  collapsed,
  onNavigate,
}: Props) => {
  const pathname = usePathname()
  const curMonth = useCurMonth()
  const isActive = isActivePath(pathname, to, end)
  return (
    <Link
      href={withMonth(to, curMonth)}
      aria-current={isActive ? "page" : undefined}
      title={collapsed ? label : undefined}
      onClick={onNavigate}
      // Same padding and height collapsed or not, so the icons never move
      // when the rail opens or closes
      className={`flex items-center gap-3 h-11 px-2.5 w-full text-lg border-2 border-transparent rounded-lg
        hover:bg-grass-300 hover:border-grass-600 hover:text-grass-800
        focus-visible:outline-none focus-visible:border-grass-700
        aria-[current=page]:bg-white aria-[current=page]:text-grass-900
        aria-[current=page]:font-semibold aria-[current=page]:shadow-sm`}
    >
      <Icon className="size-6 shrink-0" />
      <span className={collapsed ? "sr-only" : "truncate"}>{label}</span>
    </Link>
  )
}
