import { Link } from "react-router"

interface Props {
  title: string
  to: string
}

export const TrendCard: React.FC<Props> = props => {
  const { title, to, ...rest } = props
  return (
    <Link
      className="flex items-center justify-center border-2 rounded-lg w-40 h-40"
      to={to}
    >
      {title}
    </Link>
  )
}
