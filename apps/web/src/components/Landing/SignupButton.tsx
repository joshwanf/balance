"use client"

import { useState } from "react"
import { AnimatePresence } from "motion/react"
import * as Btn from "@/lib/Base/Button"
import { Modal } from "@/lib/ComponentLibrary/Modal"
import { SignupForm } from "@/components/Landing/SignupForm"

export const SignupButton = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Btn.PrimaryButton onClick={() => setOpen(true)}>
        Sign Up
      </Btn.PrimaryButton>
      <AnimatePresence>
        {open && (
          <Modal
            selector="#authNode"
            closeModal={() => setOpen(false)}
            element={<SignupForm closeModal={() => setOpen(false)} />}
          />
        )}
      </AnimatePresence>
    </>
  )
}
