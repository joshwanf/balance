import { m, LazyMotion, domAnimation } from "motion/react"
import { ReactNode } from "react"

interface Props {
  children: ReactNode
  closePopover: () => void
  overlayStyle?: "none" | "darken" | "blur"
}

export const Overlay: React.FC<Props> = props => {
  const { children, closePopover, overlayStyle, ...rest } = props
  const bgStyle = {
    none: {},
    darken: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
    blur: { backdropFilter: "blur(6px)" },
  }
  return (
    <LazyMotion features={domAnimation}>
      <m.div
        transition={{ delay: 0, duration: 0.5, type: "ease-out" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="overlay"
        onClick={closePopover}
        style={{ ...bgStyle[overlayStyle || "none"] }}
      >
        {children}
      </m.div>
    </LazyMotion>
  )
}
