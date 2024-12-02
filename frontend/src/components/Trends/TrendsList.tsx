import { Overview } from "./Overview"

interface Props {}

export const TrendsList: React.FC<Props> = props => {
  return (
    <div>
      <h1>Trends</h1>
      <div>
        <Overview />
      </div>
    </div>
  )
}
