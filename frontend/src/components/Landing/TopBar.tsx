import { useState } from "react"
import { createPortal } from "react-dom"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { logout, selectUser } from "../../features/sessionSlice"

import ComponentSelector from "../../lib/ComponentLibrary"
import { Modal } from "../../lib/ComponentLibrary/Modal"
import { LoginForm } from "./LoginForm"
import { SignupForm } from "./SignupForm"
import * as Btn from "../../lib/Base/Button"
import balance from "../../utils/api"
import { AnimatePresence } from "motion/react"

interface Props {
  // isLoggedIn: boolean
  // setIsLoggedIn: (input: boolean) => void
}
export const TopBar: React.FC<Props> = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectUser)
  const [display, setDisplay] = useState<string | null>(null)
  const closeModal = () => setDisplay(null)

  const handleLogout = async (e: React.FocusEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const response = await balance.session.logout()
    dispatch(logout())
    // setIsLoggedIn(false)
  }
  return (
    <nav className="py-4 flex justify-between">
      <Btn.PrimaryButton>Component Library</Btn.PrimaryButton>
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
