import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  scales,
} from "chart.js"
import { Bar } from "react-chartjs-2"
import { useRef, useState } from "react"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface Props {
  categories:
    | {
        name: string
        outgoing: number
      }[]
    | null
}

export const OverviewChart: React.FC<Props> = props => {
  const { categories, ...rest } = props
  const labels = categories?.map(c => c.name) || []
  const yVals = categories?.map(c => c.outgoing) || []
  const data = {
    labels: labels,
    datasets: [
      {
        label: "My First dataset",
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        data: yVals,
      },
    ],
  }
  const options = {
    aspectRatio: 1,
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
          text: "Spending category",
        },
        grid: {
          display: false,
        },
      },
    },
  }

  const config = {
    type: "bar",
    data: data,
  }

  return <Bar data={data} options={options} />
}
