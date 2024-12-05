// import { motion } from "motion/react"
import { m, LazyMotion, domAnimation } from "motion/react"

interface Props {
  children: any
  additionalClasses?: string[]
  classSchema?: {
    bgColor?: string
    hoverBgColor?: string
    borderColor?: string
    hoverBorderColor?: string
    textColor?: string
    hoverTextColor?: string
  }
  [key: string]: any
}
export const PrimaryButton = (props: Props) => {
  const { children, additionalClasses, classSchema: cs, ...rest } = props

  const classSchema = props.classSchema || {}
  const {
    bgColor,
    hoverBgColor,
    borderColor,
    hoverBorderColor,
    textColor,
    hoverTextColor,
  } = classSchema

  const unifiedBgColor = bgColor ?? "bg-grass-700"
  const unifiedBorderColor = borderColor ?? "border-grass-700"
  const unifiedHoverBgColor = hoverBgColor ?? "hover:bg-grass-600"
  const unifiedHoverBorderColor = hoverBorderColor ?? "hover:border-grass-600"
  const unifiedTextColor = textColor ?? "text-white"

  const defaultClasses = [
    "px-3",
    "py-0.5",
    "mx-1",
    unifiedBgColor,
    unifiedBorderColor,
    "border-2",
    "rounded-md",
    // "text-white",
    unifiedTextColor,
    unifiedHoverBgColor,
    unifiedHoverBorderColor,
    "active:bg-grass-800",
    "active:border-grass-800",
    // "active:ring-4",
    // "active:ring-blue-400",
  ]

  const unifiedClassNames = [
    ...defaultClasses,
    ...(additionalClasses || []),
  ].join(" ")

  return (
    <LazyMotion features={domAnimation}>
      <m.button
        whileTap={{ scale: 0.95 }}
        className={unifiedClassNames}
        {...rest}
      >
        {children}
      </m.button>
    </LazyMotion>
  )
}
