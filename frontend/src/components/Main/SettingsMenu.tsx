import { LogOut } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { SecondaryButton } from "../../lib/Base/Button"
import { useAppDispatch } from "../../app/hooks"
import balance from "../../utils/api"
import { logout, setCurMonth } from "../../features/sessionSlice"
import { useNavigate } from "react-router"
import dayjs from "dayjs"

interface Props {
  // closeMenu: (input: boolean) => void
}
export const SettingsMenu: React.FC<Props> = props => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleLogout = async (e: React.FocusEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const response = await balance.session.logout()
    dispatch(setCurMonth(dayjs().format("YYYY-MM")))
    dispatch(logout())
    // navigate("/")
    window.location.href = "/"
  }

  return (
    <div className="p-2 border-2 rounded-lg bg-grass-300 border-grass-700 text-grass-800">
      <SecondaryButton
        onClick={handleLogout}
        additionalClasses={[
          "py-0.5",
          "px-4",
          "flex",
          "flex-row",
          "items-center",
        ]}
      >
        <LogOut size={16} className="mr-2" />
        Logout
      </SecondaryButton>
      <div>User settings</div>
    </div>
  )
}
