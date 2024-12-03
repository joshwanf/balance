import {
  Chart as ChartJS,
  Colors,
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

export const OverviewChart: React.FC<Props> = props => {
  const { categories, labels, ...rest } = props
  const datasets =
    categories?.map(c => ({
      label: c.name,
      data: c.outgoing,
    })) || []

  const data = {
    labels: labels,
    datasets: datasets,
    // datasets: [
    //   {
    //     label: "My First dataset",
    //     backgroundColor: "rgb(255, 99, 132)",
    //     borderColor: "rgb(255, 99, 132)",
    //     data: yVals,
    //   },
    // ],
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

  const newData = {
    labels: ["month1", "month2", "month3"],
    datasets: [
      {
        label: "category1",
        backgroundColor: "pink",
        data: [1, 2, 3],
      },
      {
        label: "category2",
        backgroundColor: "green",
        data: [undefined, 2, 3],
      },
      {
        label: "category3",
        backgroundColor: "blue",
        data: [undefined, undefined, undefined],
      },
      {
        label: "category4",
        backgroundColor: "yellow",
        data: [undefined, 2, undefined],
      },
    ],
  }

  const config = {
    type: "bar",
    data: data,
  }

  // return <Bar data={data} options={options} />
  return <Bar data={data} options={options} />
}
