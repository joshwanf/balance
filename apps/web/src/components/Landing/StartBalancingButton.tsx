"use client"

import { useState } from "react"
import { AnimatePresence } from "motion/react"
import * as Btn from "@/lib/Base/Button"
import { Modal } from "@/lib/ComponentLibrary/Modal"
import { SignupForm } from "@/components/Landing/SignupForm"

interface Props {
  className?: string
}
export const StartBalancingButton = ({ className }: Props) => {
  const [open, setOpen] = useState(false)

  const startBalancing = () => {
    setOpen(true)
  }

  return (
    <>
      <Btn.SecondaryButton onClick={startBalancing} className={className}>
        Start Balancing
      </Btn.SecondaryButton>
      <AnimatePresence>
        {open && (
          <Modal
            selector="#authNode"
            closeModal={() => setOpen(false)}
            element={<SignupForm />}
          />
        )}
      </AnimatePresence>
    </>
  )
}
