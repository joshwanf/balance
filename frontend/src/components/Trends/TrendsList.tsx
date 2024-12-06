import { useRef, useState } from "react"
import { Overview } from "./Overview/Overview"
import { TrendCard } from "./TrendCard"
import { Popover } from "../../lib/ComponentLibrary/Popover/Popover"
import { SettingsMenu } from "../Main/SettingsMenu"

interface Props {}

export const TrendsList: React.FC<Props> = props => {
  const [showPopover, setShowPopover] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
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
      <div onClick={() => setShowPopover(true)} ref={ref}>
        Open popover
      </div>
      {showPopover && (
        <Popover
          selector="#authNode"
          closePopover={() => setShowPopover(false)}
          callerRef={ref}
          // content={<SettingsMenu />}
          overlayStyle="blur"
          positionStyle="aboveLeftAligned"
        >
          <SettingsMenu />
        </Popover>
      )}
    </div>
  )
}
