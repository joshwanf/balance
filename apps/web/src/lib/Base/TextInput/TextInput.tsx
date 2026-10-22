"use client"
// import "./TextInput.css"

interface Props {
  text: string
  onChange: (input: string) => void
  [key: string]: any
}
const TextInput = ({ text, onChange, ...rest }: Props) => {
  return (
    <input
      // className="text-input"
      className="outline-none"
      value={text}
      onChange={e => onChange(e.target.value)}
      {...rest}
    />
  )
}
// framer-motion
export default TextInput
