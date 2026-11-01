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

const HOVER_OFFSET = 16

interface Props {
  data: ApiTypes.Trend.PieChart
}

export const CompareChart = ({ data, ...rest }: Props) => {
  // each category keeps its own colour, so the two months can be compared
  const { theme, colorFor } = useChartTheme()
  const chartData = {
    labels: data.summary.map(s => s.name),
    datasets: [
      {
        label: data.month,
        data: data.summary.map(
          s => Money.fromCents(s.spent.toString()).dollars,
        ),
        backgroundColor: data.summary.map(s => colorFor(s.name)),
        hoverOffset: HOVER_OFFSET,
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
      options={{
        layout: { padding: HOVER_OFFSET },
        plugins: { legend: { position: "bottom" } },
      }}
    />
  )
}
