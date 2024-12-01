import { motion } from "motion/react"
import * as Btn from "../../lib/Base/Button"
interface Props {
  closeModal: () => void
  onDelete: (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => void
}
export const ConfirmDelete: React.FC<Props> = props => {
  const { closeModal, onDelete, ...rest } = props
  return (
    <motion.div
      // initial={{ scale: 0, opacity: 0 }}
      // animate={{ scale: 1, opacity: 1 }}
      // exit={{ scale: 0, opacity: 0 }}
      className="bg-white p-6 space-y-2 rounded-md"
    >
      <div>Are you sure you want to delete the account?</div>
      <div className="space-x-4">
        <Btn.PrimaryButton
          additionalClasses={[
            "px-6",
            "py-0.5",
            "rounded-md",
            "bg-slate-200",
            "text-red-600",
            "font-semibold",
            "hover:bg-red-700",
            "hover:text-white",
          ]}
          onClick={onDelete}
        >
          Delete
        </Btn.PrimaryButton>
        <Btn.PrimaryButton
          additionalClasses={[
            "px-6",
            "py-0.5",
            "rounded-md",
            "bg-slate-500",
            "text-white",
            "font-semibold",
            "hover:bg-slate-400",
          ]}
          onClick={closeModal}
        >
          Cancel
        </Btn.PrimaryButton>
      </div>
    </motion.div>
  )
}
