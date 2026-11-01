"use client"
import { SidebarLink } from "./SidebarLink"
import { NAV_LINKS } from "./navLinks"

interface Props {
  /** desktop icon rail */
  collapsed?: boolean
  /** called when a link is followed, so the phone drawer can close */
  onNavigate?: () => void
}
export const Sidebar = ({ collapsed, onNavigate }: Props) => {
  return (
    <nav aria-label="Main" className="flex flex-col gap-4">
      <div className="flex items-center gap-2 h-10 px-2.5">
        <img src="/assets/balance.svg" alt="" className="size-7" />
        <span
          className={
            collapsed ? "sr-only" : "text-xl font-semibold text-brand-800"
          }
        >
          Balance
        </span>
      </div>
      <div className="space-y-2 text-neutral-600">
        {NAV_LINKS.map(l => (
          <SidebarLink
            key={l.to}
            {...l}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </nav>
  )
}
