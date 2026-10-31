// Light / dark / system theme. The choice lives in localStorage and is
// applied as <html data-theme="..."> before first paint by THEME_SCRIPT.
// With no choice ("system") there is no data-theme and the CSS follows
// prefers-color-scheme (see the plugin in tailwind.config.js).

export type ThemeChoice = "light" | "dark" | "system"

export const THEME_STORAGE_KEY = "theme"
// Fired on window when the choice changes, so charts can re-read colours
export const THEME_CHANGE_EVENT = "themechange"

// The shell colour of each theme (tailwind.tokens.js), for the browser chrome
export const THEME_COLOR = { light: "#edecec", dark: "#000000" } as const

// Point every theme-color meta at the forced theme, or back at its own
// media query when following the system
function applyThemeColor(choice: ThemeChoice) {
  document
    .querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
    .forEach(m => {
      const own = m.media.includes("dark")
        ? THEME_COLOR.dark
        : THEME_COLOR.light
      m.content = choice === "system" ? own : THEME_COLOR[choice]
    })
}

export function readThemeChoice(): ThemeChoice {
  try {
    const t = localStorage.getItem(THEME_STORAGE_KEY)
    return t === "light" || t === "dark" ? t : "system"
  } catch {
    return "system"
  }
}

export function setThemeChoice(choice: ThemeChoice) {
  try {
    if (choice === "system") localStorage.removeItem(THEME_STORAGE_KEY)
    else localStorage.setItem(THEME_STORAGE_KEY, choice)
  } catch {
    // private mode: the choice lasts for this page only
  }
  const root = document.documentElement
  if (choice === "system") delete root.dataset.theme
  else root.dataset.theme = choice
  applyThemeColor(choice)
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT))
}

// Runs inline in <head>, before the body paints, so a saved theme never
// flashes the other one. Kept tiny and dependency-free on purpose.
export const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});if(t!=="light"&&t!=="dark")return;document.documentElement.dataset.theme=t;var c=${JSON.stringify(
  THEME_COLOR,
)}[t];document.addEventListener("DOMContentLoaded",function(){document.querySelectorAll('meta[name="theme-color"]').forEach(function(m){m.content=c})})}catch(e){}})()`
