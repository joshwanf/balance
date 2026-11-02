"use client"
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
export const PrimaryButton = ({
  children,
  additionalClasses,
  classSchema: cs,
  ...rest
}: Props) => {
  const classSchema = cs || {}
  const {
    bgColor,
    hoverBgColor,
    borderColor,
    hoverBorderColor,
    textColor,
    hoverTextColor,
  } = classSchema

  const unifiedBgColor = bgColor ?? "bg-brand-700"
  const unifiedBorderColor = borderColor ?? "border-brand-700"
  const unifiedHoverBgColor = hoverBgColor ?? "hover:bg-brand-600"
  const unifiedHoverBorderColor = hoverBorderColor ?? "hover:border-brand-600"
  const unifiedTextColor = textColor ?? "text-surface"

  const defaultClasses = [
    "px-3",
    "py-0.5",
    "mx-1",
    unifiedBgColor,
    unifiedBorderColor,
    "border-2",
    "rounded-md",
    // "text-surface",
    unifiedTextColor,
    unifiedHoverBgColor,
    unifiedHoverBorderColor,
    "active:bg-brand-800",
    "active:border-brand-800",
    // "active:ring-4",
    // "active:ring-info-400",
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
