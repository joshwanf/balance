import { Outlet } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { selectUser } from "../../features/sessionSlice"
import { TopBar } from "../Landing/TopBar"
import { TransactionsList } from "../Transactions/TransactionsList"
import { Sidebar } from "./Sidebar"
import { useEffect } from "react"

export const Main = () => {
  // const dispatch = useAppDispatch()
  // const session = useAppSelector(selectUser)
  return (
    <div className="flex flex-row bg-slate-200 h-screen overflow-hidden">
      <div className="bg-slate-200 w-1/5 ">
        <Sidebar />
      </div>
      <div className="w-full pt-4 pr-2 pb-6 h-screen overflow-y-auto">
        <div className="bg-white rounded-t-3xl rounded-b-3xl px-4 pb-6">
          <TopBar />
          <Outlet />
        </div>
      </div>
    </div>
  )
}
