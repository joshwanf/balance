"use client"
import { useRef, useState } from "react"
import { Check } from "lucide-react"
import { Popover } from "@/lib/ComponentLibrary/Popover/Popover"
import {
  CATEGORY_COLORS,
  CategoryColor,
  categoryColorVar,
} from "@/theme/categoryColors"

interface Props {
  name: string
  color: CategoryColor
  onPick: (color: CategoryColor) => void
}

const swatch = (c: CategoryColor) => ({
  backgroundColor: `rgb(${categoryColorVar(c)})`,
})

/** A dot in the category's colour that opens a grid of the 12 hues */
export const CategoryColorPicker = ({ name, color, onPick }: Props) => {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label={`Colour for ${name}: ${color}. Change colour`}
        aria-expanded={open}
        onClick={e => {
          e.stopPropagation()
          setOpen(o => !o)
        }}
        className="grid size-6 shrink-0 place-items-center rounded-full hover:bg-neutral-100
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
      >
        <span className="size-3 rounded-full" style={swatch(color)} />
      </button>
      {open && (
        <Popover
          callerRef={buttonRef}
          selector="#authNode"
          closePopover={() => setOpen(false)}
          positionStyle="belowLeftAligned"
        >
          <div
            role="radiogroup"
            aria-label={`Colour for ${name}`}
            className="grid grid-cols-6 gap-1.5 rounded-lg border bg-surface p-2 shadow-lg"
          >
            {CATEGORY_COLORS.map(c => (
              <button
                key={c}
                type="button"
                role="radio"
                aria-checked={c === color}
                aria-label={c}
                title={c}
                onClick={() => {
                  setOpen(false)
                  if (c !== color) onPick(c)
                }}
                className="grid size-7 place-items-center rounded-full text-surface
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                style={swatch(c)}
              >
                {c === color && <Check className="size-4" aria-hidden="true" />}
              </button>
            ))}
          </div>
        </Popover>
      )}
    </>
  )
}
