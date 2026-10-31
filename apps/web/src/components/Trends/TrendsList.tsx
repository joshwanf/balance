import { ChartColumn, ChartPie } from "lucide-react"
import { withMonth } from "@/utils/month"
import { TrendCard } from "./TrendCard"

interface Props {
  month: string
}

export const TrendsList = ({ month }: Props) => {
  const trends = [
    {
      title: "Overview",
      description: "Spending by category over 1, 3 or 6 months",
      to: "/my-balance/trends/overview",
      Icon: ChartColumn,
    },
    {
      title: "Compare",
      description: "Two months of spending side by side",
      to: "/my-balance/trends/compare",
      Icon: ChartPie,
    },
  ]
  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-xl font-semibold text-grass-900">Trends</h1>
      {/* one column on phones, two from sm */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6">
        {trends.map(({ to, ...t }) => (
          <TrendCard key={t.title} {...t} to={withMonth(to, month)} />
        ))}
      </div>
    </div>
  )
}
