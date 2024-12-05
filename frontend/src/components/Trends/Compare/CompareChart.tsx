import {
  Chart as ChartJS,
  Colors,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PieController,
} from "chart.js"
import { Pie } from "react-chartjs-2"
import { ApiTypes } from "../../../types/api"
import { Money } from "../../../utils/classes/Money"

ChartJS.register(
  CategoryScale,
  ArcElement,
  PieController,
  Title,
  Tooltip,
  Legend,
  Colors,
)

interface Props {
  data: ApiTypes.Trend.PieChart
}

export const CompareChart: React.FC<Props> = props => {
  const { data, ...rest } = props
  const chartData = {
    labels: data.summary.map(s => s.name),
    datasets: [
      {
        label: data.month,
        data: data.summary.map(s => Money.fromCents(s.spent.toString())),
      },
    ],
  }

  if (data.summary.length === 0) {
    return <div>No spending data for {data.month}</div>
  }

  const data2 = {
    labels: ["Red", "Blue", "Yellow"],
    datasets: [
      {
        label: "My First Dataset",
        data: [300, 50, 100],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
        ],
        hoverOffset: 4,
      },
    ],
  }
  return <Pie data={chartData} />
}
