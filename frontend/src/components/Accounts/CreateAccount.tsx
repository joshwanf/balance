import { FilePlus } from "lucide-react"
import { motion } from "motion/react"

interface Props {
  onAfterSubmitForm: () => void
}
export const CreateAccount: React.FC<Props> = props => {
  const { onAfterSubmitForm, ...rest } = props

  return (
    <div>
      <motion.div
        whileFocus={{ scale: 0.9 }}
        className="border-4 border-dashed border-grass-300 rounded-lg 
      hover:cursor-pointer hover:shadow-lg
      p-4 h-full flex flex-col items-center justify-center text-grass-400"
      >
        <FilePlus />
        <div>Add a new account</div>
      </motion.div>
    </div>
  )
}
