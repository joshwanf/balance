"use client"
import { LogOut } from "lucide-react"
import { SecondaryButton } from "../../lib/Base/Button"
import { useTransition } from "react"
import { logoutAction } from "@/server/actions/auth"
import { ThemeSwitcher } from "./ThemeSwitcher"

export const SettingsMenu = () => {
  const [isPending, startTransition] = useTransition()

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction()
    })
  }
  return (
    <div className="grid w-64 gap-3 rounded-lg border bg-surface p-3 text-ink shadow-lg">
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
      <ThemeSwitcher />
    </div>
  )
}
