import { Cog } from "lucide-react"
import { useState } from "react"
import { SettingsMenu } from "./SettingsMenu"

interface Props {}
export const SettingsButton: React.FC<Props> = props => {
  const [showMenu, setShowMenu] = useState(false)

  const handleShowMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    setShowMenu(!showMenu)
  }
  return (
    <div className="relative">
      <div
        className="bg-slate-200 w-fit px-2 mb-10
      hover:cursor-pointer  text-grass-700 animate-spin-slow"
        onClick={handleShowMenu}
      >
        <Cog />
      </div>
      {showMenu && <SettingsMenu closeMenu={setShowMenu} />}
    </div>
  )
}
