import { createPortal } from "react-dom"
import { Overlay } from "./Overlay"
import { ContentAnimation } from "./ContentAnimation"
import "./Popover.css"
import { useEffect, useState } from "react"

interface Props {
  selector: string
  closePopover: () => void
  callerRef: React.RefObject<HTMLElement>
  children: React.ReactNode
  overlayStyle?: "none" | "darken" | "blur"
  positionStyle?:
    | "inCenter"
    | "fromRight"
    | "fromBottom"
    | "belowLeftAligned"
    | "aboveLeftAligned"
}
export const Popover: React.FC<Props> = props => {
  const {
    selector,
    closePopover,
    callerRef,
    overlayStyle,
    positionStyle,
    ...rest
  } = props
  const node = document.querySelector(selector)

  const getContentPosition = (
    style: string,
    ref: React.RefObject<HTMLElement>,
  ) => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect()
      const positions: Record<string, any> = {
        inCenter: {
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        },
        fromRight: {
          right: 0,
          top: "50%",
          transform: "translate(0%, -50%)",
        },
        fromBottom: {
          bottom: 0,
          left: "50%",
          transform: "translate(-100%, 0%)",
        },
        belowLeftAligned: {
          top: rect.bottom,
          left: rect.x,
        },
        aboveLeftAligned: {
          bottom: `calc(100% - ${rect.y}px)`,
          left: rect.x,
        },
      }
      return positions[style]
    }
  }
  // const position = getContentPosition(positionStyle || "inCenter", callerRef)
  const [position, setPosition] = useState(
    getContentPosition(positionStyle || "inCenter", callerRef),
  )
  // const [rect, setRect] = useState({})
  useEffect(() => {
    const updatePosition = () => {
      if (callerRef.current) {
        setPosition(getContentPosition(positionStyle || "inCenter", callerRef))
      }
    }

    // Initial position update
    updatePosition()

    // Update position whenever the button size or position changes
    const resizeObserver = new ResizeObserver(updatePosition)
    if (callerRef.current) {
      resizeObserver.observe(callerRef.current)
    }

    // if (callerRef.current) {
    //   setPosition(getContentPosition(positionStyle || "inCenter", callerRef))
    // }
    return () => {
      if (callerRef.current) {
        resizeObserver.unobserve(callerRef.current)
      }
    }
  }, [callerRef])
  if (!node || !callerRef.current) return <></>

  return (
    <>
      {createPortal(
        <Overlay closePopover={closePopover} overlayStyle={overlayStyle}>
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: "absolute",
              // ...positions[positionStyle || "inCenter"],
              ...position,
            }}
          >
            <ContentAnimation overlayStyle={overlayStyle}>
              {props.children}
            </ContentAnimation>
          </div>
        </Overlay>,
        node,
      )}
    </>
  )
}
