"use client"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { motion, useReducedMotion } from "motion/react"
import { X } from "lucide-react"
import { useScrollLock } from "@/hooks/useScrollLock"
interface Props {
  selector: string
  element: React.JSX.Element
  /** called with the click event, or with nothing for Escape */
  closeModal: (e?: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => void
  title?: string
}
/**
 * Panel that slides in from the right: full width on phones, max-w-md from sm.
 * It scrolls on its own and closes from its X button, the backdrop or Escape.
 */
export const SideModal = ({ selector, element, closeModal, title }: Props) => {
  const [portalNode, setPortalNode] = useState<Element | null>(null)
  const reduceMotion = useReducedMotion()
  useScrollLock()
  useEffect(() => {
    setPortalNode(document.querySelector(selector))
  }, [selector])
  useEffect(() => {
    const keyDown = (e: KeyboardEvent) => e.key === "Escape" && closeModal()
    window.addEventListener("keydown", keyDown)
    return () => window.removeEventListener("keydown", keyDown)
  }, [closeModal])
  if (!portalNode) return null

  const slide = reduceMotion ? {} : { x: "100%" }

  return (
    <>
      {createPortal(
        <div
          onClick={closeModal}
          className="fixed inset-0 flex justify-end items-start z-50 bg-black/20 backdrop-blur-sm"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={slide}
            animate={{ x: 0 }}
            exit={slide}
            transition={{ type: "tween", ease: "easeOut", duration: 0.2 }}
            onClick={e => e.stopPropagation()}
            className="bg-white h-dvh w-full sm:max-w-md shadow-lg flex flex-col"
          >
            <div className="flex items-center justify-between gap-2 border-b-2 px-4 py-3">
              <h2 className="truncate text-lg font-semibold">{title}</h2>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Close"
                className="shrink-0 rounded-md p-1 text-slate-600 hover:bg-slate-100
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grass-600"
              >
                <X />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-6">
              {element}
            </div>
          </motion.div>
        </div>,
        portalNode,
      )}
    </>
  )
}
