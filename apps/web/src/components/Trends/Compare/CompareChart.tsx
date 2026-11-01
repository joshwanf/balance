"use client"
import {
  Chart as ChartJS,
  Colors,
  Tooltip,
  Legend,
  ArcElement,
  PieController,
} from "chart.js"
import { useChartTheme } from "@/theme/useChartTheme"
import { Pie } from "react-chartjs-2"
import type { ApiTypes } from "@balance/api-types"
import { Money } from "../../../utils/classes/Money"

ChartJS.register(ArcElement, PieController, Colors, Legend, Tooltip)

interface Props {
  data: ApiTypes.Trend.PieChart
  /** category name to colour, shared by both charts */
  colors: Record<string, string>
}

export const CompareChart = ({ data, colors, ...rest }: Props) => {
  const { theme } = useChartTheme()
  const chartData = {
    labels: data.summary.map(s => s.name),
    datasets: [
      {
        label: data.month,
        data: data.summary.map(
          s => Money.fromCents(s.spent.toString()).dollars,
        ),
        backgroundColor: data.summary.map(s => colors[s.name]),
        hoverOffset: 20,
      },
    ],
  }

  if (data.summary.length === 0) {
    return <div>No spending data for {data.month}</div>
  }

  return (
    <Pie
      key={theme}
      data={chartData}
      options={{ plugins: { legend: { position: "bottom" } } }}
    />
  )
}
