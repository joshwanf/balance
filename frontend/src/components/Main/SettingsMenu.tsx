import { Cog, LogOut } from "lucide-react"
import { motion, useTime, useTransform } from "motion/react"
import { useState } from "react"
import * as Btn from "../../lib/Base/Button"

interface Props {}
export const SettingsMenu: React.FC<Props> = props => {
  const [showMenu, setShowMenu] = useState(false)
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
  }
  return (
    // <motion.div
    //   style={{
    //     rotate: useTransform(useTime(), [0, 4000], [0, 360], {
    //       clamp: false,
    //     }),
    //   }}
    //   className="bg-slate-200 w-fit px-2 mb-10
    //   hover:cursor-pointer text-grass-700"
    // >
    //   <Cog />
    // </motion.div>

    <div className="relative">
      <div
        className="bg-slate-200 w-fit px-2 mb-10
    hover:cursor-pointer  text-grass-700 animate-spin-slow"
        onClick={e => setShowMenu(!showMenu)}
      >
        <Cog />
      </div>
      {showMenu && (
        <div className="absolute bottom-20 left-2 p-2 border-2 rounded-lg bg-grass-300 border-grass-700 text-grass-800">
          <Btn.SecondaryButton
            additionalClasses={[
              "py-0.5",
              "px-4",
              "flex",
              "flex-row",
              "items-center",
            ]}
            bgColor="grass-700"
            borderColor="grass-800"
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </Btn.SecondaryButton>
          <div>My text here</div>
        </div>
      )}
    </div>
  )
}
