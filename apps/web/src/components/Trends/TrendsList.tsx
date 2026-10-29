import { withMonth } from "@/utils/month"
import { TrendCard } from "./TrendCard"

interface Props {
  month: string
}

export const TrendsList = ({ month }: Props) => {
  const trends = [
    { title: "Overview", to: "/my-balance/trends/overview" },
    { title: "Compare", to: "/my-balance/trends/compare" },
  ]
  return (
    <div>
      <h1>Trends</h1>
      <div className="flex space-x-2">
        {trends.map(t => (
          <TrendCard
            key={t.title}
            title={t.title}
            to={withMonth(t.to, month)}
          />
        ))}
      </div>
    </div>
  )
}
