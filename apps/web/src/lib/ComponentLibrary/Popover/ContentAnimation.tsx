"use client"
import { domAnimation, LazyMotion, m } from "motion/react"

interface Props {
  overlayStyle?: "none" | "blur" | "darken"
  children: React.ReactNode
}

export const ContentAnimation = ({ children, overlayStyle }: Props) => {
  if (overlayStyle === "darken") {
    return (
      <LazyMotion features={domAnimation}>
        <m.div
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ delay: 0.2, duration: 0.2, ease: "linear" }}
        >
          {children}
        </m.div>
      </LazyMotion>
    )
  }
  return <div>{children}</div>
}
