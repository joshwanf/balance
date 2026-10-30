"use client"
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
export const FloatingErrors = ({ errors }: Props) => (
  <div
    role="alert"
    className="absolute left-0 top-full z-10 mt-1 w-max max-w-xs text-sm shadow-md"
  >
    <Errors errors={errors} />
  </div>
)
