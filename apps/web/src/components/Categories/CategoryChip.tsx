import { CategoryColor, categoryColorVar } from "@/theme/categoryColors"

interface Props {
  name: string
  color: CategoryColor
  className?: string
}

/** A category name on a pill tinted with the category's colour */
export const CategoryChip = ({ name, color, className = "" }: Props) => (
  <span
    className={`category-chip inline-block max-w-full truncate rounded-full px-2 text-xs font-semibold leading-5 ${className}`}
    style={{ "--chip": categoryColorVar(color) } as React.CSSProperties}
    title={name}
  >
    {name}
  </span>
)

/** Shown where a transaction has no category */
export const UnassignedChip = ({ className = "" }: { className?: string }) => (
  <span
    className={`inline-block rounded-full border border-dashed border-neutral-500 px-2 text-xs leading-5 text-neutral-600 ${className}`}
  >
    Unassigned
  </span>
)
