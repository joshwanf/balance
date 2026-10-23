"use client"
import { LogOut } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { SecondaryButton } from "../../lib/Base/Button"
import { useAppDispatch } from "../../store/hooks"
import balance from "../../utils/api"
import { logout } from "../../features/sessionSlice"

interface Props {
  // closeMenu: (input: boolean) => void
}
export const SettingsMenu = ({}: Props) => {
  const dispatch = useAppDispatch()

  const handleLogout = async (e: React.FocusEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const response = await balance.session.logout()
    dispatch(logout())
    // router.push("/")
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
