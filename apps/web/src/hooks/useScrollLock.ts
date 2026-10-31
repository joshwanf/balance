"use client"
import { useEffect } from "react"

// Overlays can stack (a confirm modal over the details drawer), so the page
// is unlocked only when the last one closes
let locks = 0

/**
 * Stops the page behind an overlay from scrolling while `active`. Below lg the
 * document itself scrolls, so without this a swipe on a drawer or modal
 * scrolls the list underneath.
 */
export const useScrollLock = (active = true) => {
  useEffect(() => {
    if (!active) return
    const html = document.documentElement
    if (locks++ === 0) html.style.overflow = "hidden"
    return () => {
      if (--locks === 0) html.style.overflow = ""
    }
  }, [active])
}
