import { useState } from "react"
import { createPortal } from "react-dom"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { logout, selectUser, setCurMonth } from "../../features/sessionSlice"

import { Modal } from "../../lib/ComponentLibrary/Modal"
import { LoginForm } from "./LoginForm"
import { SignupForm } from "./SignupForm"
import * as Btn from "../../lib/Base/Button"
import balance from "../../utils/api"
import { AnimatePresence } from "motion/react"
import moment from "moment"
import { listTransactionsThunk } from "../../utils/thunks/transactions"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useNavigate } from "react-router"

interface Props {
  // isLoggedIn: boolean
  // setIsLoggedIn: (input: boolean) => void
}
export const TopBar: React.FC<Props> = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector(selectUser)
  const [display, setDisplay] = useState<string | null>(null)
  const closeModal = () => setDisplay(null)

  const curMonth = useAppSelector(state => state.session.settings.curMonth)
  const changeCurMonth = (by: number) => () => {
    const newMonth = moment(curMonth, "YYYY-MM")
      .add(by, "month")
      .format("YYYY-MM")
    dispatch(setCurMonth(newMonth))
    dispatch(listTransactionsThunk({ startMonth: newMonth }))
  }
  const handleLogout = async (e: React.FocusEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const response = await balance.session.logout()
    dispatch(logout())
    navigate("/")
    // setIsLoggedIn(false)
  }
  return (
    <nav className="py-4 flex justify-between">
      <div className="flex space-x-1">
        <button onClick={changeCurMonth(-1)}>
          <ChevronLeft />
        </button>
        <div className="text-center w-24">
          {moment(curMonth).format("MMMM")}
          <br />
          {moment(curMonth).format("YYYY")}
        </div>
        <button onClick={changeCurMonth(1)}>
          <ChevronRight />
        </button>
      </div>
      <div>
        {user ? (
          <Btn.SecondaryButton onClick={handleLogout}>
            Log Out
          </Btn.SecondaryButton>
        ) : (
          <>
            <Btn.PrimaryButton onClick={() => setDisplay("signup")}>
              Sign Up
            </Btn.PrimaryButton>
            <Btn.SecondaryButton onClick={() => setDisplay("login")}>
              Log In
            </Btn.SecondaryButton>
          </>
        )}
      </div>
      <AnimatePresence>
        {display === "login" && (
          <Modal
            selector="#authNode"
            closeModal={closeModal}
            element={<LoginForm closeModal={closeModal} />}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {display === "signup" && (
          <Modal
            selector="#authNode"
            closeModal={closeModal}
            element={<SignupForm closeModal={closeModal} />}
          />
        )}
      </AnimatePresence>
    </nav>
  )
}
