import { Outlet } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { selectUser } from "../../features/sessionSlice"
import { TopBar } from "../Landing/TopBar"
import { TransactionsList } from "../Transactions/TransactionsList"
import { Sidebar } from "./Sidebar"
import { useEffect, useRef, useState } from "react"
import {
  SquareChevronDown,
  SquareChevronLeft,
  SquareChevronRight,
} from "lucide-react"
import { useKeyPress } from "./useKeyPress"

export const Main = () => {
  const sidebarMenuRef = useRef<HTMLDivElement>(null)
  const isLgViewport = window.matchMedia("(min-width: 1024px)").matches
  const [hideSidebar, setHideSidebar] = useState(!isLgViewport)

  useEffect(() => {
    const setSidebarStatus = () => {
      const isSmViewport = window.matchMedia("(max-width: 1024px)").matches
      if (isSmViewport) {
        setHideSidebar(true)
      } else {
        setHideSidebar(false)
      }
      if (sidebarMenuRef.current && !isSmViewport) {
        sidebarMenuRef.current.hidden = true
      } else if (sidebarMenuRef.current) {
        sidebarMenuRef.current.hidden = false
      }
    }
    window.addEventListener("resize", setSidebarStatus)
    return () => window.removeEventListener("resize", setSidebarStatus)
  }, [setHideSidebar])
  return (
    <div className="flex flex-row bg-slate-200 h-screen overflow-hidden">
      <div className="bg-slate-200 w-fit px-2 flex flex-col items-end">
        {!isLgViewport && (
          <div
            ref={sidebarMenuRef}
            onClick={() => setHideSidebar(!hideSidebar)}
            className="pt-8 cursor-pointer"
          >
            {hideSidebar ? <SquareChevronRight /> : <SquareChevronLeft />}
          </div>
        )}

        <Sidebar hidden={hideSidebar} />
      </div>
      <div className="w-full pt-4 px-2 pb-6 h-screen overflow-y-auto">
        <div className="bg-white rounded-t-3xl rounded-b-3xl px-4 pb-6">
          <TopBar />
          <Outlet />
        </div>
      </div>
    </div>
  )
}
