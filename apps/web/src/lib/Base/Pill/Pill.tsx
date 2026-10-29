"use client"
import "./Pill.css"

interface Props {
  text: string
  // onClick: () => void
  [key: string]: any
}
export const Pill = ({ text, ...rest }: Props) => {
  return (
    <div className="pill" {...rest}>
      <div className="pill-close">&times;</div>
      {text}
    </div>
  )
}
