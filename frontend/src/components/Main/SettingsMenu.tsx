import { Cog, LogOut } from "lucide-react"
import { motion, useTime, useTransform } from "motion/react"
import { useEffect, useRef, useState } from "react"
import * as Btn from "../../lib/Base/Button"
import { useAppDispatch } from "../../app/hooks"
import balance from "../../utils/api"
import { logout, setCurMonth } from "../../features/sessionSlice"
import { useNavigate } from "react-router"
import moment from "moment"

interface Props {
  closeMenu: (input: boolean) => void
}
export const SettingsMenu: React.FC<Props> = props => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { closeMenu } = props

  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const handleClickOutside = (e: MouseEvent) => {
    e.stopPropagation()
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      closeMenu(false)
    }
  }

  const handleLogout = async (e: React.FocusEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const response = await balance.session.logout()
    dispatch(setCurMonth(moment().format("YYYY-MM")))
    dispatch(logout())
    navigate("/")
  }

  useEffect(() => {
    document.addEventListener("click", handleClickOutside)

    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

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

    <div ref={menuRef} className="relative">
      {/* <div
        className="bg-slate-200 w-fit px-2 mb-10
    hover:cursor-pointer  text-grass-700 animate-spin-slow"
        onClick={e => setShowMenu(!showMenu)}
      >
        <Cog />
      </div> */}
      {/* {showMenu && ( */}
      <div className="absolute bottom-20 left-2 p-2 border-2 rounded-lg bg-grass-300 border-grass-700 text-grass-800">
        <Btn.SecondaryButton
          onClick={handleLogout}
          additionalClasses={[
            "py-0.5",
            "px-4",
            "flex",
            "flex-row",
            "items-center",
          ]}
          // classSchema={{
          //   bgColor: "bg-grass-500",
          //   hoverBgColor: "hover:bg-grass-800",
          //   borderColor: "border-grass-800",
          //   hoverBorderColor: "hover:border-grass-800",
          // }}
        >
          <LogOut size={16} className="mr-2" />
          Logout
        </Btn.SecondaryButton>
        <div>User settings</div>
      </div>
      {/* )} */}
    </div>
  )
}
