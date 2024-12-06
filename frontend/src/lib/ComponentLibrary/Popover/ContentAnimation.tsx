import { domAnimation, LazyMotion, m } from "motion/react"

interface Props {
  overlayStyle?: "none" | "blur" | "darken"
  children: React.ReactNode
}

export const ContentAnimation: React.FC<Props> = props => {
  if (props.overlayStyle === "darken") {
    return (
      <LazyMotion features={domAnimation}>
        <m.div
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ delay: 0.2, duration: 0.2, ease: "linear" }}
        >
          {props.children}
        </m.div>
      </LazyMotion>
    )
  }
  return <div>{props.children}</div>
}
