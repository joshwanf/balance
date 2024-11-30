import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "motion/react"
interface Props {
  selector: string
  element: JSX.Element
  closeModal: (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => void
}
export const SideModal: React.FC<Props> = props => {
  const { selector, element, closeModal, ...rest } = props
  const portalNode = document.querySelector(selector)
  if (!portalNode) return <div></div>

  return (
    <>
      {createPortal(
        <div
          onClick={closeModal}
          className="fixed inset-0  flex justify-end items-center z-50 backdrop-blur-sm transition-opacity duration-1000"
        >
          <motion.div
            animate={{
              x: [200, 0, 50, 0],
              transition: { ease: ["easeIn", "easeOut"], duration: 0.5 },
            }}
            exit={{ opacity: 0, scale: 1.3 }}
            onClick={e => e.stopPropagation()}
            className="bg-white h-screen shadow-lg w-1/2"
          >
            {element}
          </motion.div>
        </div>,
        portalNode,
      )}
    </>
  )
}
