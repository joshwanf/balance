import { motion } from "motion/react"

interface Props {
  children: any
  additionalClasses?: string[]
  bgColor?: string
  borderColor?: string
  [key: string]: any
}
export const SecondaryButton: React.FC<Props> = props => {
  const { children, additionalClasses, bgColor, borderColor, ...rest } = props
  const unifiedBgColor = `bg-${bgColor ?? "slate-700"}`
  const unifiedBorderColor = `border-${borderColor ?? "slate-700"}`
  const defaultClasses = [
    // default style
    "px-3",
    "py-1",
    "mx-1",
    unifiedBgColor,
    "border-2",
    unifiedBorderColor,
    "rounded-md",
    "text-white",
    // hover style
    "hover:bg-slate-500",
    "hover:border-slate-500",
    // active style
    "active:bg-slate-800",
    "active:border-slate-800",
    // "active:ring-4",
    // "active:ring-blue-400",
  ]
  const classNames = [...defaultClasses].join(" ")
  const unifiedClassNames = [
    ...defaultClasses,
    ...(additionalClasses || []),
  ].join(" ")
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      className={unifiedClassNames}
      {...rest}
    >
      {children}
    </motion.button>
  )
}
