"use client"
import { Cog } from "lucide-react"
import { useRef, useState } from "react"
import { SettingsMenu } from "./SettingsMenu"
import { Popover } from "../../lib/ComponentLibrary/Popover/Popover"

interface Props {}
export const SettingsButton = ({}: Props) => {
  const [showMenu, setShowMenu] = useState(false)
  const callerRef = useRef<HTMLButtonElement>(null)

  const handleShowMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setShowMenu(!showMenu)
  }
  return (
    <div className="relative">
      <button
        ref={callerRef}
        type="button"
        aria-label="Settings"
        aria-expanded={showMenu}
        className="p-1 rounded-md text-brand-700 hover:text-brand-900
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
        onClick={handleShowMenu}
      >
        <Cog className="hover:animate-spin-slow motion-reduce:animate-none" />
      </button>
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
