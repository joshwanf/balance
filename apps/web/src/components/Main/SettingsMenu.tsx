"use client"
import { LogOut } from "lucide-react"
import { SecondaryButton } from "../../lib/Base/Button"
import { useTransition } from "react"
import { logoutAction } from "@/server/actions/auth"

export const SettingsMenu = () => {
  const [isPending, startTransition] = useTransition()

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction()
    })
  }
  return (
    <div className="p-2 border-2 rounded-lg bg-brand-300 border-brand-700 text-brand-800">
      <SecondaryButton
        disabled={isPending}
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
