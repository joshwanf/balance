import { motion } from "motion/react"

interface Props {
  children: any
  // onClick: (input: any) => void
  additionalClasses?: string[]
  [key: string]: any
}
export const PrimaryButton = (props: Props) => {
  const { children, additionalClasses, ...rest } = props
  const defaultClasses = [
    // default style
    "px-3",
    "py-1",
    "mx-1",
    "bg-blue-500",
    "border-2",
    "border-blue-500",
    "rounded-md",
    "text-white",
    // hover style
    "hover:bg-blue-400",
    "hover:border-blue-400",
    // active style
    "active:bg-blue-600",
    "active:border-blue-600",
    "active:ring-4",
    "active:ring-blue-400",
  ]
  const classNames = additionalClasses || defaultClasses
  const unifiedClassNames = classNames.join(" ")
  // const unifiedClassNames = [
  //   ...defaultClasses,
  //   ...(additionalClasses || []),
  // ].join(" ")
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
