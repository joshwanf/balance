"use client"
import { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCurMonth } from "../../hooks/useUrlState"
import { withMonth } from "../../utils/month"

interface Props {
  children: ReactNode
  to: string
}
export const SidebarLink = ({ children, to, ...rest }: Props) => {
  const pathname = usePathname()
  const curMonth = useCurMonth()
  // Mirrors react-router NavLink's default (non-`end`) matching
  const isActive = pathname === to || (pathname?.startsWith(to + "/") ?? false)
  return (
    <Link
      href={withMonth(to, curMonth)}
      aria-current={isActive ? "page" : undefined}
      className={`flex py-1 px-4 w-full text-lg border-2 rounded-lg hover:bg-grass-300 hover:border-grass-600 hover:text-grass-800${isActive ? " active" : ""}`}
    >
      {children}
    </Link>
  )
}
