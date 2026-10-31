"use client"
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
export const SecondaryButton = ({
  children,
  additionalClasses,
  classSchema: cs,
  ...rest
}: Props) => {
  const classSchema = cs || {}
  const { bgColor, hoverBgColor, borderColor, hoverBorderColor } = classSchema

  const unifiedBgColor = bgColor ?? "bg-neutral-700"
  const unifiedBorderColor = borderColor ?? "border-neutral-700"
  const unifiedHoverBgColor = hoverBgColor ?? "hover:bg-neutral-500"
  const unifiedHoverBorderColor = hoverBorderColor ?? "hover:border-neutral-500"

  const defaultClasses = [
    "px-3",
    "py-0.5",
    "mx-1",
    unifiedBgColor,
    unifiedBorderColor,
    "border-2",
    "rounded-md",
    "text-surface",
    unifiedHoverBgColor,
    unifiedHoverBorderColor,
    "active:bg-neutral-800",
    "active:border-neutral-800",
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
