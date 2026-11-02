"use client"
import React, { useRef, useState } from "react"

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  text: string
  onFinishEditing?: (newValue: string) => boolean | Promise<boolean>
  /** Escape was pressed: the edit is dropped without saving */
  onCancel?: () => void
  additionalClasses?: string[]
}

export const EditableText = ({
  text,
  type,
  onFinishEditing,
  onCancel,
  additionalClasses,
  ...rest
}: Props) => {
  const [isEditing, setIsEditing] = useState(false)
  const [committed, setCommitted] = useState(text)
  const [draft, setDraft] = useState(text)
  const [prevText, setPrevText] = useState(text)
  // set by Escape so the blur that follows doesn't save
  const cancelled = useRef(false)

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
    } else if (e.key === "Escape") {
      e.preventDefault()
      cancelled.current = true
      e.currentTarget.blur()
    }
  }

  const handleStartEditing = () => {
    setDraft(committed)
    setIsEditing(true)
  }

  const handleStopEditing = async () => {
    setIsEditing(false)
    if (cancelled.current) {
      cancelled.current = false
      setDraft(committed)
      onCancel?.()
      return
    }
    if (draft === committed) return

    const previous = committed
    setCommitted(draft)

    const result = (await onFinishEditing?.(draft)) ?? true
    if (!result) setCommitted(previous)
  }

  const defaultClasses = [
    // default style
    // same box in both states, so starting to edit doesn't change the row height
    "w-full h-8 px-2 py-0.5 leading-6",
    "border rounded-md",
    "hover:border-brand-300",
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
          className={`${unifiedClassNames} border-brand-600`}
          onKeyDown={handleKeyDown}
          {...rest}
        />
      ) : (
        <div
          onClick={handleStartEditing}
          onFocus={handleStartEditing}
          tabIndex={0}
          role="button"
          className={`${unifiedClassNames} inline-block truncate border-transparent cursor-pointer`}
        >
          {committed || (
            <span className="text-neutral-400">
              {rest.placeholder ?? "\u00A0"}
            </span>
          )}
        </div>
      )}
    </>
  )
}
