import { ReactNode } from "react"
import { NavLink } from "react-router-dom"

interface Props {
  children: ReactNode
  to: string
}
export const SidebarLink: React.FC<Props> = props => {
  const { children, to, ...rest } = props
  return (
    <NavLink
      to={to}
      className="flex py-1 px-4 w-full text-lg border-2 rounded-lg hover:bg-grass-300 hover:border-grass-600 hover:text-grass-800"
    >
      {children}
    </NavLink>
  )
}
