import { ReactNode } from "react"
import { Link } from "react-router-dom"

interface Props {
  children: ReactNode
  to: string
}
export const SidebarLink: React.FC<Props> = props => {
  const { children, to, ...rest } = props
  return (
    <Link
      to={to}
      className="flex py-1 pl-4 text-lg border-2 rounded-lg hover:bg-grass-300 hover:border-grass-600 hover:text-grass-800"
    >
      {children}
    </Link>
  )
}
