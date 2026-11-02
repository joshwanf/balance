"use client"
import { Monitor, Moon, Sun } from "lucide-react"
import { ThemeChoice } from "@/theme/theme"
import { useThemeChoice } from "@/theme/useThemeChoice"

const OPTIONS: { value: ThemeChoice; label: string; Icon: typeof Sun }[] = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Monitor },
]

/** Light / Dark / System segmented control */
export const ThemeSwitcher = () => {
  const [choice, setChoice] = useThemeChoice()
  return (
    <fieldset className="grid gap-1">
      <legend className="mb-1 text-sm font-semibold">Theme</legend>
      <div className="flex rounded-lg bg-brand-100 p-0.5">
        {OPTIONS.map(({ value, label, Icon }) => (
          <label
            key={value}
            className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md px-2.5 py-1 text-sm
              text-brand-800 hover:text-brand-900
              has-[:checked]:bg-surface has-[:checked]:font-semibold has-[:checked]:text-brand-900 has-[:checked]:shadow-sm
              has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-600"
          >
            <input
              type="radio"
              name="theme"
              value={value}
              checked={choice === value}
              onChange={() => setChoice(value)}
              className="sr-only"
            />
            <Icon className="size-4" aria-hidden="true" />
            {label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}
