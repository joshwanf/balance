"use client"
import { useMemo } from "react"
import { Chart as ChartJS } from "chart.js"
import { useResolvedTheme } from "./useThemeChoice"

const cssColor = (name: string, fallback: string) => {
  if (typeof window === "undefined") return fallback
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue(`--${name}`)
    .trim()
  return v ? `rgb(${v})` : fallback
}

/**
 * Points Chart.js's text and slice-border colours at the current theme.
 * Returns the theme name (use it as the chart's `key` so it redraws when the
 * theme changes; Chart.js reads defaults only when a chart is created) and
 * the line colour for axes. Axis colours go in each chart's options, not
 * ChartJS.defaults.borderColor: changing that default turns off the Colors
 * plugin that colours the bars.
 */
export const useChartTheme = () => {
  const theme = useResolvedTheme()
  useMemo(() => {
    ChartJS.defaults.color = cssColor("neutral-600", "#666")
    // only there once a pie chart has registered ArcElement
    const arc = ChartJS.defaults.elements.arc
    if (arc) arc.borderColor = cssColor("surface", "#fff")
    // theme is the trigger: the CSS variables have already switched
  }, [theme])
  const line = useMemo(
    () => cssColor("neutral-400", "rgba(0,0,0,0.1)"),
    [theme],
  )
  return { theme, line }
}
