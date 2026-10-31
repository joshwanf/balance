"use client"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Menu, PanelLeftClose, PanelLeftOpen, X } from "lucide-react"
import { Sidebar } from "./Sidebar"
import { SettingsButton } from "./SettingsButton"
import { MonthNavigator } from "./MonthNavigator"
import { SIDEBAR_COOKIE, sectionLabel } from "./navLinks"
import { useUrlTransition } from "../../hooks/urlTransition"

interface Props {
  children?: React.ReactNode
  /** from the sidebar cookie, so the server renders the rail at its final width */
  defaultCollapsed?: boolean
}

const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable ||
    ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))

/**
 * App shell. Layout is decided by CSS breakpoints only, so the server HTML is
 * already right for every screen size: from lg up a sidebar (or icon rail),
 * below lg a top bar whose menu opens the nav as an overlay drawer.
 */
export const Main = ({ children, defaultCollapsed = false }: Props) => {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(defaultCollapsed)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [prevPathname, setPrevPathname] = useState(pathname)
  const { isPending } = useUrlTransition()

  if (pathname !== prevPathname) {
    setPrevPathname(pathname)
    setDrawerOpen(false)
  }

  const toggleCollapsed = () => {
    const next = !collapsed
    setCollapsed(next)
    document.cookie = `${SIDEBAR_COOKIE}=${next ? "collapsed" : "open"}; path=/; max-age=31536000; samesite=lax`
  }

  useEffect(() => {
    const keyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDrawerOpen(false)
        return
      }
      if (e.key !== "[" || e.metaKey || e.ctrlKey || e.altKey) return
      if (isTyping(e.target)) return
      e.preventDefault()
      if (window.matchMedia("(min-width: 1024px)").matches) toggleCollapsed()
      else setDrawerOpen(open => !open)
    }
    window.addEventListener("keydown", keyDown)
    return () => window.removeEventListener("keydown", keyDown)
  })

  return (
    <div data-app-shell className="flex h-dvh bg-slate-200">
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col justify-between shrink-0 py-4 px-2
          transition-[width] duration-150 ease-in-out motion-reduce:transition-none
          ${collapsed ? "w-16" : "w-56"}`}
      >
        <Sidebar collapsed={collapsed} />
        <div
          className={`flex gap-2 ${collapsed ? "flex-col items-center" : "items-center justify-between px-3"}`}
        >
          <SettingsButton />
          <button
            type="button"
            onClick={toggleCollapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={`${collapsed ? "Expand" : "Collapse"} sidebar ( [ )`}
            className="p-1 rounded-md text-grass-700 hover:text-grass-900
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grass-600"
          >
            {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
          </button>
        </div>
      </aside>

      {/* Phone and tablet drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-40 ${drawerOpen ? "" : "pointer-events-none"}`}
        inert={!drawerOpen}
      >
        <div
          onClick={() => setDrawerOpen(false)}
          className={`absolute inset-0 bg-black/40 transition-opacity motion-reduce:transition-none
            ${drawerOpen ? "opacity-100" : "opacity-0"}`}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className={`absolute inset-y-0 left-0 w-64 max-w-[85vw] bg-slate-200 shadow-xl
            flex flex-col justify-between py-4 px-2
            transition-transform duration-200 ease-out motion-reduce:transition-none
            ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="space-y-2">
            <div className="flex justify-end px-1">
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
                className="p-1 rounded-md text-grass-700 hover:text-grass-900"
              >
                <X />
              </button>
            </div>
            <Sidebar onNavigate={() => setDrawerOpen(false)} />
          </div>
          <div className="px-3">
            <SettingsButton />
          </div>
        </div>
      </div>

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Phone and tablet top bar */}
        <header className="lg:hidden flex items-center gap-3 px-3 h-12 shrink-0">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            aria-expanded={drawerOpen}
            className="p-1 rounded-md text-grass-800 hover:bg-grass-300"
          >
            <Menu />
          </button>
          <span className="font-semibold text-grass-900 truncate">
            {sectionLabel(pathname)}
          </span>
        </header>

        <main className="flex-1 overflow-y-auto [scrollbar-gutter:stable] px-2 pb-6 lg:pt-4">
          <div className="bg-white rounded-3xl px-4 pb-6">
            <MonthNavigator />
            {/* a month or search change keeps the old page, dimmed, until the new one is ready */}
            <div
              aria-busy={isPending}
              className={`transition-opacity duration-150 motion-reduce:transition-none ${isPending ? "opacity-50" : ""}`}
            >
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
