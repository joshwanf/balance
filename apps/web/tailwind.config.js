/** @type {import('tailwindcss').Config} */
import plugin from "tailwindcss/plugin"
import { light, dark, STEPS } from "./tailwind.tokens.js"

// Every colour is a CSS variable holding "r g b", so Tailwind can still add
// opacity (bg-black/40) and a theme only has to change the variables.
// Tailwind's default palette is replaced, not extended: use these names,
// not slate, red, etc.
const v = name => `rgb(var(--${name}) / <alpha-value>)`
const scale = name => Object.fromEntries(STEPS.map(s => [s, v(`${name}-${s}`)]))

const rgb = hex => {
  const n = parseInt(hex.slice(1), 16)
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`
}
// { brand: { 50: "#..." }, surface: "#..." } -> { "--brand-50": "r g b", "--surface": "r g b" }
const toVars = tokens =>
  Object.fromEntries(
    Object.entries(tokens).flatMap(([name, value]) =>
      typeof value === "string"
        ? [[`--${name}`, rgb(value)]]
        : Object.entries(value).map(([s, hex]) => [`--${name}-${s}`, rgb(hex)]),
    ),
  )

// Category chips: how strongly the hue tints the chip, and its outline
const lightVars = {
  ...toVars(light),
  "--chip-tint": "20%",
  "--chip-ring": "0%",
  colorScheme: "light",
}
const darkVars = {
  ...toVars(dark),
  "--chip-tint": "30%",
  "--chip-ring": "45%",
  colorScheme: "dark",
}

// No data-theme: follow the OS. data-theme="light" | "dark": the user's
// choice from the settings menu, set before first paint (see ThemeScript).
const themeVars = plugin(({ addBase }) => {
  addBase({
    ":root": lightVars,
    "@media (prefers-color-scheme: dark)": {
      ':root:not([data-theme="light"])': darkVars,
    },
    ':root[data-theme="dark"]': darkVars,
  })
})

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      inherit: "inherit",
      // Scrims behind overlays stay black in every theme
      black: "#000",
      // App shell behind the cards
      shell: v("shell"),
      // Cards, inputs and text on solid buttons
      surface: v("surface"),
      // Body text
      ink: v("ink"),
      // Default border colour
      line: v("line"),
      // Landing page background
      paper: v("paper"),
      "paper-strong": v("paper-strong"),
      // The app's accent
      brand: scale("brand"),
      // Borders, secondary text and quiet backgrounds
      neutral: scale("neutral"),
      danger: scale("danger"),
      success: scale("success"),
      warning: scale("warning"),
      info: scale("info"),
      // Category hues, for swatches (chips use the .category-chip class)
      cat: Object.fromEntries(
        Object.keys(light.cat).map(k => [k, v(`cat-${k}`)]),
      ),
    },
    extend: {
      // Bare `border` and `ring` classes use these
      borderColor: { DEFAULT: v("line") },
      ringColor: { DEFAULT: "rgb(var(--info-500) / 0.5)" },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
      },
    },
  },
  plugins: [themeVars],
}
