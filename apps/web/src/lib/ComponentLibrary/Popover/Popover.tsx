"use client"
import { createPortal } from "react-dom"
import { Overlay } from "./Overlay"
import { ContentAnimation } from "./ContentAnimation"
import "./Popover.css"
import { useEffect, useLayoutEffect, useRef, useState } from "react"

/** gap kept between the popover and the viewport edges */
const MARGIN = 8
/** gap between the popover and its anchor */
const OFFSET = 4

interface Props {
  selector: string
  closePopover: () => void
  callerRef: React.RefObject<HTMLElement | null>
  children: React.ReactNode
  overlayStyle?: "none" | "darken" | "blur"
  /** preferred side of the anchor; flips when that side has no room */
  positionStyle?: "belowLeftAligned" | "aboveLeftAligned"
}

/**
 * Content anchored to `callerRef`, over a click-to-close overlay. It follows
 * the anchor when any ancestor scrolls or the window resizes, flips to the
 * other side when its preferred side has no room, and stays inside the
 * viewport. Escape closes it, and so does scrolling the anchor out of view.
 */
export const Popover = ({
  children,
  selector,
  closePopover,
  callerRef,
  overlayStyle,
  positionStyle = "belowLeftAligned",
}: Props) => {
  const [node, setNode] = useState<Element | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  // null until measured, so the first frame isn't drawn in the wrong place
  const [position, setPosition] = useState<{ top: number; left: number }>()

  useEffect(() => {
    setNode(document.querySelector(selector))
  }, [selector])

  useEffect(() => {
    const keyDown = (e: KeyboardEvent) => e.key === "Escape" && closePopover()
    window.addEventListener("keydown", keyDown)
    return () => window.removeEventListener("keydown", keyDown)
  }, [closePopover])

  useLayoutEffect(() => {
    const anchor = callerRef.current
    const content = contentRef.current
    if (!anchor || !content) return

    const place = () => {
      const a = anchor.getBoundingClientRect()
      const { width, height } = content.getBoundingClientRect()
      const vw = document.documentElement.clientWidth
      const vh = window.innerHeight
      // anchor scrolled out of sight: close rather than float detached
      if (a.bottom < 0 || a.top > vh) {
        closePopover()
        return
      }

      const below = a.bottom + OFFSET
      const above = a.top - OFFSET - height
      const fitsBelow = below + height <= vh - MARGIN
      const fitsAbove = above >= MARGIN
      const top =
        positionStyle === "belowLeftAligned"
          ? fitsBelow || !fitsAbove
            ? below
            : above
          : fitsAbove || !fitsBelow
            ? above
            : below

      const clamp = (v: number, max: number) =>
        Math.max(MARGIN, Math.min(v, max - MARGIN))
      setPosition({
        top: clamp(top, vh - height),
        left: clamp(a.left, vw - width),
      })
    }

    place()
    // capture, so scrolling any ancestor (not just the window) moves it too
    window.addEventListener("scroll", place, true)
    window.addEventListener("resize", place)
    const observer = new ResizeObserver(place)
    observer.observe(anchor)
    observer.observe(content)
    return () => {
      window.removeEventListener("scroll", place, true)
      window.removeEventListener("resize", place)
      observer.disconnect()
    }
    // closePopover is left out: callers pass a new arrow each render, and
    // re-subscribing on every render would re-place for nothing
  }, [callerRef, positionStyle, node])

  if (!node) return null

  return createPortal(
    <Overlay closePopover={closePopover} overlayStyle={overlayStyle}>
      <div
        ref={contentRef}
        onClick={e => e.stopPropagation()}
        style={{
          position: "fixed",
          top: position?.top ?? 0,
          left: position?.left ?? 0,
          visibility: position ? "visible" : "hidden",
        }}
      >
        <ContentAnimation overlayStyle={overlayStyle}>
          {children}
        </ContentAnimation>
      </div>
    </Overlay>,
    node,
  )
}
