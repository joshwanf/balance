"use client"
import { useCallback, useSyncExternalStore } from "react"
import {
  readThemeChoice,
  setThemeChoice,
  THEME_CHANGE_EVENT,
  ThemeChoice,
} from "./theme"

const subscribe = (onChange: () => void) => {
  window.addEventListener(THEME_CHANGE_EVENT, onChange)
  // another tab changed it
  window.addEventListener("storage", onChange)
  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, onChange)
    window.removeEventListener("storage", onChange)
  }
}

/** The saved theme choice and a setter. "system" on the server. */
export const useThemeChoice = () => {
  const choice = useSyncExternalStore<ThemeChoice>(
    subscribe,
    readThemeChoice,
    () => "system",
  )
  const setChoice = useCallback((c: ThemeChoice) => setThemeChoice(c), [])
  return [choice, setChoice] as const
}

const subscribeResolved = (onChange: () => void) => {
  const mq = window.matchMedia("(prefers-color-scheme: dark)")
  mq.addEventListener("change", onChange)
  const off = subscribe(onChange)
  return () => {
    mq.removeEventListener("change", onChange)
    off()
  }
}
const readResolved = () => {
  const c = readThemeChoice()
  if (c !== "system") return c
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

/** The theme actually on screen, following the OS when set to system */
export const useResolvedTheme = () =>
  useSyncExternalStore<"light" | "dark">(
    subscribeResolved,
    readResolved,
    () => "light",
  )
