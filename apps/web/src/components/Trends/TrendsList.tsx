import { TrendCard } from "./TrendCard"

interface Props {}

export const TrendsList = ({}: Props) => {
  const trends = [
    { title: "Overview", to: "/my-balance/trends/overview" },
    { title: "Compare", to: "/my-balance/trends/compare" },
  ]
  return (
    <div>
      <h1>Trends</h1>
      <div className="flex space-x-2">
        {trends.map(t => (
          <TrendCard key={t.title} title={t.title} to={t.to} />
        ))}
      </div>
    </div>
  )
}
