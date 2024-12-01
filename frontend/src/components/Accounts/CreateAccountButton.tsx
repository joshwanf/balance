import { FilePlus } from "lucide-react"
import { motion } from "motion/react"

interface Props {
  onClick: () => void
}
export const CreateAccountButton: React.FC<Props> = props => {
  const { onClick } = props
  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="hover:cursor-pointer
          w-full h-full
          flex flex-col items-center justify-center 
          text-grass-400"
    >
      <FilePlus />
      <div>Add a new account</div>
    </motion.div>
  )
}
