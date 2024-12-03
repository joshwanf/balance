import { m, LazyMotion, domAnimation } from "motion/react"

interface Props {
  children: any
  additionalClasses?: string[]
  classSchema?: {
    bgColor?: string
    hoverBgColor?: string
    borderColor?: string
    hoverBorderColor?: string
  }
  [key: string]: any
}
export const TertiaryButton: React.FC<Props> = props => {
  const { children, additionalClasses, ...rest } = props

  const classSchema = props.classSchema || {}
  const { bgColor, hoverBgColor, borderColor, hoverBorderColor } = classSchema

  const unifiedBgColor = bgColor ?? "bg-beige"
  const unifiedBorderColor = borderColor ?? "border-grass-700"
  const unifiedHoverBgColor = hoverBgColor ?? "hover:bg-grass-100"
  const unifiedHoverBorderColor = hoverBorderColor ?? "hover:border-grass-700"

  const defaultClasses = [
    // default style
    "px-3",
    "py-0.5",
    "mx-1",
    "border-2",
    "rounded-md",
    unifiedBgColor,
    unifiedBorderColor,
    unifiedHoverBgColor,
    unifiedHoverBorderColor,
    "active:bg-grass-300",
    "active:ring-0",
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
