interface Props {
  errors: Record<string, string> | string
}
export const Errors: React.FC<Props> = ({ errors }) => {
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
