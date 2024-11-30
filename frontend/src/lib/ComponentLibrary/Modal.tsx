import { motion } from "motion/react"
import { createPortal } from "react-dom"

interface Props {
  selector: string
  element: JSX.Element
  closeModal: () => void
}
export const Modal: React.FC<Props> = props => {
  const { selector, element, closeModal, ...rest } = props
  const authNode = document.querySelector(selector)
  if (!authNode) return <div></div>

  return (
    <>
      {createPortal(
        <motion.div
          transition={{ delay: 0, duration: 0.5, type: "tween" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        >
          <motion.div
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ delay: 0.2, duration: 0.2, ease: "linear" }}
            onClick={e => e.stopPropagation()}
          >
            {element}
          </motion.div>
        </motion.div>,
        authNode,
      )}
    </>
  )
}
