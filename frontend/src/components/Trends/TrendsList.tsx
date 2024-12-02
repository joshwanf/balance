import { Overview } from "./Overview/Overview"
import { TrendCard } from "./TrendCard"

interface Props {}

export const TrendsList: React.FC<Props> = props => {
  const trends = [
    { title: "Overview", to: "overview" },
    { title: "Compare", to: "compare" },
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
