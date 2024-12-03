import { FilePlus } from "lucide-react"
import { m, LazyMotion, domAnimation } from "motion/react"

interface Props {
  onClick: () => void
}
export const CreateAccountButton: React.FC<Props> = props => {
  const { onClick } = props
  return (
    <LazyMotion features={domAnimation}>
      <m.div
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className="hover:cursor-pointer
          w-full h-full
          flex flex-col items-center justify-center 
          text-grass-400"
      >
        <FilePlus />
        <div>Add a new account</div>
      </m.div>
    </LazyMotion>
  )
}
