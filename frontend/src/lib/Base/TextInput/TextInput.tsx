// import "./TextInput.css"

interface Props {
  text: string
  onChange: (input: string) => void
  [key: string]: any
}
const TextInput = (props: Props) => {
  // const { textValue, onChange, onKeyDown, ...rest } = props
  const { text, onChange, ...rest } = props
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
