import { motion } from "motion/react"

interface Props {
  children: any
  additionalClasses?: string[]
  [key: string]: any
}
export const TertiaryButton: React.FC<Props> = props => {
  const { children, additionalClasses, ...rest } = props
  const defaultClasses = [
    // default style
    "px-3",
    "py-1",
    "mx-1",
    "bg-white",
    "border-2",
    "border-blue-600",
    // "outline-blue-600",
    "rounded-md",
    //   "text-white",
    // hover style
    "hover:bg-blue-100",
    // active style
    "active:bg-blue-300",
    // "active:shadow-lg",
    "active:ring-0",
    "active:ring-blue-400",
  ]
  const classNames = [...defaultClasses].join(" ")
  const unifiedClassNames = [
    ...defaultClasses,
    ...(additionalClasses || []),
  ].join(" ")
  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      className={unifiedClassNames}
      {...rest}
    >
      {children}
    </motion.button>
  )
}
