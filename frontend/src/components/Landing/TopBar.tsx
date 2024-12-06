import { useRef, useState } from "react"
import { useAppSelector } from "../../app/hooks"
import { selectUser } from "../../features/sessionSlice"

import { Modal } from "../../lib/ComponentLibrary/Modal"
import { LoginForm } from "./LoginForm"
import { SignupForm } from "./SignupForm"
import * as Btn from "../../lib/Base/Button"
import { AnimatePresence } from "motion/react"
import { Popover } from "../../lib/ComponentLibrary/Popover/Popover"

interface Props {}
export const TopBar: React.FC<Props> = () => {
  const user = useAppSelector(selectUser)
  const [display, setDisplay] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const closeModal = () => setDisplay(null)

  return (
    <nav className="py-4 flex justify-end">
      <div>
        {!user && (
          <div ref={ref}>
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
          // <Modal
          //   selector="#authNode"
          //   closeModal={closeModal}
          //   element={<LoginForm closeModal={closeModal} />}
          // />
          <Popover
            selector="#authNode"
            callerRef={ref}
            closePopover={closeModal}
            // content={<LoginForm closeModal={closeModal} />}
            overlayStyle="darken"
          >
            <LoginForm closeModal={closeModal} />
          </Popover>
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
