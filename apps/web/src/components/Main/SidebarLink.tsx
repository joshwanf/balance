"use client"
import { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface Props {
  children: ReactNode
  to: string
}
export const SidebarLink: React.FC<Props> = props => {
  const { children, to, ...rest } = props
  const pathname = usePathname()
  // Mirrors react-router NavLink's default (non-`end`) matching
  const isActive =
    pathname === to || (pathname?.startsWith(to + "/") ?? false)
  return (
    <Link
      href={to}
      aria-current={isActive ? "page" : undefined}
      className={`flex py-1 px-4 w-full text-lg border-2 rounded-lg hover:bg-grass-300 hover:border-grass-600 hover:text-grass-800${isActive ? " active" : ""}`}
    >
      {children}
    </Link>
  )
}
