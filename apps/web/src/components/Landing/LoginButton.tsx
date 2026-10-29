"use client"

import { useState } from "react"
import { AnimatePresence } from "motion/react"
import * as Btn from "@/lib/Base/Button"
import { Modal } from "@/lib/ComponentLibrary/Modal"
import { LoginForm } from "@/components/Landing/LoginForm"

export const LoginButton = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Btn.SecondaryButton onClick={() => setOpen(true)}>
        Log In
      </Btn.SecondaryButton>
      <AnimatePresence>
        {open && (
          <Modal
            selector="#authNode"
            closeModal={() => setOpen(false)}
            element={<LoginForm />}
          />
        )}
      </AnimatePresence>
    </>
  )
}
