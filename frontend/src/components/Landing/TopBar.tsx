import { useState } from "react"
import { useAppSelector } from "../../app/hooks"
import { selectUser } from "../../features/sessionSlice"

import { Modal } from "../../lib/ComponentLibrary/Modal"
import { LoginForm } from "./LoginForm"
import { SignupForm } from "./SignupForm"
import * as Btn from "../../lib/Base/Button"
import { AnimatePresence } from "motion/react"

interface Props {}
export const TopBar: React.FC<Props> = () => {
  const user = useAppSelector(selectUser)
  const [display, setDisplay] = useState<string | null>(null)
  const closeModal = () => setDisplay(null)

  return (
    <nav className="py-4 flex justify-end">
      <div>
        {!user && (
          <div>
            <Btn.PrimaryButton onClick={() => setDisplay("signup")}>
              Sign Up
            </Btn.PrimaryButton>
            <Btn.SecondaryButton onClick={() => setDisplay("login")}>
              Log In
            </Btn.SecondaryButton>
          </div>
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
