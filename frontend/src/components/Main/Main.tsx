import { Outlet } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { selectUser } from "../../features/sessionSlice"
import { TopBar } from "../Landing/TopBar"
import { TransactionsList } from "../Transactions/TransactionsList"
import { Sidebar } from "./Sidebar"
import { useEffect, useRef, useState } from "react"
import { Cog, SquareChevronLeft, SquareChevronRight } from "lucide-react"
import { motion, useTime, useTransform } from "motion/react"
import { SettingsMenu } from "./SettingsMenu"
// import { useKeyPress } from "./useKeyPress"

export const Main = () => {
  const sidebarMenuRef = useRef<HTMLDivElement>(null)
  const isLgViewport = window.matchMedia("(min-width: 1024px)").matches
  const [hideSidebar, setHideSidebar] = useState(!isLgViewport)

  // const mPressed = useKeyPress("m")

  // useEffect(() => {
  //   if (mPressed) {
  //     console.log("m pressed")
  //     setHideSidebar(!hideSidebar)
  //   }
  // }, [setHideSidebar])

  useEffect(() => {
    const keyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === "m") {
        e.preventDefault()
        setHideSidebar(!hideSidebar)
      }
    }
    const keyUp = (e: KeyboardEvent) => {
      if (e.key === "m") {
        console.log("m pressed")
        setHideSidebar(!hideSidebar)
      }
    }
    if (sidebarMenuRef.current) {
      window.addEventListener("keydown", keyDown)
    }
    // window.addEventListener("keyup", keyUp)

    return () => {
      if (sidebarMenuRef.current) {
        window.removeEventListener("keydown", keyDown)
      }
      // window.removeEventListener("keyup", keyUp)
    }
  }, [setHideSidebar, hideSidebar, sidebarMenuRef])

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

  const sidebarDisplayClass = hideSidebar ? "w-0" : "w-1/4"
  const sidebarContainerClass = hideSidebar ? "w-10" : "w-1/4"
  return (
    <div className="flex flex-row bg-slate-200 h-screen overflow-hidden">
      <div
        className={`flex flex-col justify-between
                   ${sidebarContainerClass} transition-all duration-150 ease-in-out`}
      >
        <div className="bg-slate-200 px-2">
          {!isLgViewport && (
            <div
              ref={sidebarMenuRef}
              onClick={() => setHideSidebar(!hideSidebar)}
              className="pt-8 cursor-pointer flex flex-col items-end"
            >
              {hideSidebar ? <SquareChevronRight /> : <SquareChevronLeft />}
            </div>
          )}

          {/* <Sidebar hidden={hideSidebar} /> */}
          {!hideSidebar && <Sidebar />}
        </div>
        <SettingsMenu />
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
