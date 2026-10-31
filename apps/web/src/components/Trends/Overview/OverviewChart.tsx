"use client"
import {
  Chart as ChartJS,
  Colors,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Bar } from "react-chartjs-2"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Colors,
)

interface Props {
  categories:
    | {
        name: string
        outgoing: Array<number>
      }[]
    | null
  labels: string[]
}

export const OverviewChart = ({ categories, labels, ...rest }: Props) => {
  const datasets =
    categories?.map(c => ({
      label: c.name,
      data: c.outgoing,
    })) || []

  const data = {
    labels: labels,
    datasets: datasets,
  }
  // fills its parent, which sets the height for each breakpoint
  const options = {
    maintainAspectRatio: false,
    plugins: { legend: { position: "bottom" as const } },
    scales: {
      y: {
        title: {
          display: true,
          text: "Dollars spent ($)",
        },
        grid: {
          display: false,
        },
      },
      x: {
        title: {
          display: true,
          text: "Month",
        },
        grid: {
          display: false,
        },
      },
    },
  }

  return <Bar data={data} options={options} />
}
