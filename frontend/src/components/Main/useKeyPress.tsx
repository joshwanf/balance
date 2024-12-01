import { useEffect, useState } from "react"

export const useKeyPress = (target: string) => {
  const [keypressed, setKeypressed] = useState(false)
  useEffect(() => {
    const keyDown = (e: KeyboardEvent) => {
      if (e.isTrusted === false) {
        e.preventDefault()
        return
      }
      if (e.key === target) {
        setKeypressed(true)
      }
    }
    const keyUp = (e: KeyboardEvent) => {
      if (e.isTrusted === false) {
        e.preventDefault()
        return
      }
      if (e.metaKey && e.key === target) {
        setKeypressed(false)
      }
    }

    window.addEventListener("keydown", keyDown)
    window.addEventListener("keyup", keyUp)

    return () => {
      window.removeEventListener("keydown", keyDown)
      window.removeEventListener("keyup", keyUp)
    }
  }, [target])

  return keypressed
}
