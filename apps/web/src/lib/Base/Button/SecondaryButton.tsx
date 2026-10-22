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

  const unifiedBgColor = bgColor ?? "bg-slate-700"
  const unifiedBorderColor = borderColor ?? "border-slate-700"
  const unifiedHoverBgColor = hoverBgColor ?? "hover:bg-slate-500"
  const unifiedHoverBorderColor = hoverBorderColor ?? "hover:border-slate-500"

  const defaultClasses = [
    "px-3",
    "py-0.5",
    "mx-1",
    unifiedBgColor,
    unifiedBorderColor,
    "border-2",
    "rounded-md",
    "text-white",
    unifiedHoverBgColor,
    unifiedHoverBorderColor,
    "active:bg-slate-800",
    "active:border-slate-800",
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
