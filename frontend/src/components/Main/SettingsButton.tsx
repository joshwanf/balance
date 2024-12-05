import { Cog } from "lucide-react"
import { useRef, useState } from "react"
import { SettingsMenu } from "./SettingsMenu"
import { Popover } from "../../lib/ComponentLibrary/Popover/Popover"

interface Props {}
export const SettingsButton: React.FC<Props> = props => {
  const [showMenu, setShowMenu] = useState(false)
  const callerRef = useRef<HTMLDivElement>(null)

  const handleShowMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    setShowMenu(!showMenu)
  }
  return (
    <div className="relative px-2">
      <div
        ref={callerRef}
        className="bg-slate-200 w-fit mb-10
      hover:cursor-pointer  text-grass-700 animate-spin-slow"
        onClick={handleShowMenu}
      >
        <Cog />
      </div>
      {showMenu && (
        <Popover
          callerRef={callerRef}
          selector="#authNode"
          closePopover={() => setShowMenu(false)}
          positionStyle="aboveLeftAligned"
        >
          <SettingsMenu />
        </Popover>
      )}
    </div>
  )
}
