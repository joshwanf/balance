"use client"
import { useEffect } from "react"
interface Props {
  errors: Record<string, string> | string
}
export const Errors = ({ errors }: Props) => {
  const baseTwClasses = []
  if (typeof errors === "string") {
    return (
      <div className="error bg-red-100 border-2 border-red-300 rounded-md text-center text-wrap">
        {errors}
      </div>
    )
  } else if (typeof errors === "object") {
    const allErrors = Object.entries(errors)
    return allErrors.map(([errorType, msg]) => (
      <div
        className="error bg-red-100 border-2 border-red-300 rounded-md text-center"
        key={errorType}
      >
        {msg}
      </div>
    ))
  }
}

/**
 * Errors floating just below their field, for fields inside fixed-height rows:
 * showing one doesn't resize the row or its column. Put it in a `relative` box.
 */
export const FloatingErrors = ({
  errors,
  onDismiss,
}: Props & { onDismiss?: () => void }) => {
  useEffect(() => {
    if (!onDismiss) return
    const keyDown = (e: KeyboardEvent) => e.key === "Escape" && onDismiss()
    window.addEventListener("keydown", keyDown)
    return () => window.removeEventListener("keydown", keyDown)
  }, [onDismiss])

  const messages = typeof errors === "string" ? [errors] : Object.values(errors)
  return (
    <div
      role="alert"
      className="error absolute left-0 top-full z-10 mt-1 flex w-max max-w-xs items-start gap-2
        rounded-md border-2 border-red-300 bg-red-100 py-0.5 pl-2 pr-1 text-sm shadow-md"
    >
      <div>
        {messages.map(msg => (
          <div key={msg}>{msg}</div>
        ))}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          title="Dismiss (Esc)"
          className="rounded px-1 leading-5 text-red-800 hover:bg-red-200"
        >
          &times;
        </button>
      )}
    </div>
  )
}
