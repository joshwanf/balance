/** @type {import('tailwindcss').Config} */

// Every colour comes from a CSS variable set in src/app/globals.css, so a
// theme only has to change the variables. Tailwind's default palette is
// replaced, not extended: use these names, not slate, red, etc.
const v = name => `rgb(var(--${name}) / <alpha-value>)`
const scale = (name, steps) =>
  Object.fromEntries(steps.map(s => [s, v(`${name}-${s}`)]))

const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      inherit: "inherit",
      // Scrims behind overlays stay black in every theme
      black: "#000",
      // Cards, inputs and text on solid buttons
      surface: v("surface"),
      // Default border colour (Tailwind's gray-200 before tokens)
      line: v("line"),
      // Landing page background
      paper: v("paper"),
      "paper-strong": v("paper-strong"),
      // The app's accent (was grass)
      brand: scale("brand", STEPS.slice(0, 10)),
      // Shell, borders and secondary text (was slate)
      neutral: scale("neutral", STEPS),
      danger: scale("danger", STEPS),
      success: scale("success", STEPS),
      warning: scale("warning", STEPS),
      info: scale("info", STEPS),
    },
    extend: {
      // Bare `border` and `ring` classes use these
      borderColor: { DEFAULT: v("line") },
      ringColor: { DEFAULT: "rgb(var(--info-500) / 0.5)" },
      animation: {
        "spin-slow": "spin 3s linear infinite",
      },
    },
  },
  plugins: [],
}
