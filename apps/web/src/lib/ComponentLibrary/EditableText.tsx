"use client"
import React, { useState } from "react"

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  text: string
  onFinishEditing?: (newValue: string) => boolean | Promise<boolean>
  additionalClasses?: string[]
}

export const EditableText = ({
  text,
  type,
  onFinishEditing,
  additionalClasses,
  ...rest
}: Props) => {
  const [isEditing, setIsEditing] = useState(false)
  const [committed, setCommitted] = useState(text)
  const [draft, setDraft] = useState(text)
  const [prevText, setPrevText] = useState(text)

  if (text !== prevText) {
    setPrevText(text)
    setCommitted(text)
  }

  const handleFocus: React.FocusEventHandler<HTMLInputElement> = e => {
    try {
      e.target.showPicker()
    } catch {}

    e.target.select()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation()
    if (e.key === "Enter") {
      e.preventDefault()
      e.currentTarget.blur()
    }
  }

  const handleStartEditing = () => {
    setDraft(committed)
    setIsEditing(true)
  }

  const handleStopEditing = async () => {
    setIsEditing(false)
    if (draft === committed) return

    const previous = committed
    setCommitted(draft)

    const result = (await onFinishEditing?.(draft)) ?? true
    if (!result) setCommitted(previous)
  }

  const defaultClasses = [
    // default style
    "w-full px-2 py-0.5",
    "border rounded-md",
    "hover:border-grass-300",
    "focus:outline-none",
  ]
  const unifiedClassNames = [
    ...defaultClasses,
    ...(additionalClasses || []),
  ].join(" ")

  return (
    <>
      {isEditing ? (
        <input
          autoFocus
          onFocus={handleFocus}
          type={type ?? "text"}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={handleStopEditing}
          className={`${unifiedClassNames} border-grass-600`}
          onKeyDown={handleKeyDown}
          {...rest}
        />
      ) : (
        <div
          onClick={handleStartEditing}
          onFocus={handleStartEditing}
          tabIndex={0}
          role="button"
          className={`${unifiedClassNames} inline-block border-transparent cursor-pointer`}
        >
          {committed || (
            <span className="text-slate-400">
              {rest.placeholder ?? "\u00A0"}
            </span>
          )}
        </div>
      )}
    </>
  )
}
