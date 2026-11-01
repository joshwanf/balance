"use client"
import { createContext, use, useMemo } from "react"
import { CategoryColor, categoryColor } from "@/theme/categoryColors"

export interface Lookup {
  id: string
  name: string
}

export interface CategoryLookup extends Lookup {
  /** palette key, see theme/categoryColors */
  color: string | null
}

export type Lookups = { accounts: Lookup[]; categories: CategoryLookup[] }

const LookupsContext = createContext<Promise<Lookups> | null>(null)

interface Props {
  lookups: Promise<Lookups>
  children: React.ReactNode
}

export const LookupsProvider = ({ lookups, children }: Props) => (
  <LookupsContext value={lookups}>{children}</LookupsContext>
)

export const useLookups = (): Lookups => {
  const lookups = use(LookupsContext)
  if (!lookups) {
    throw new Error("useLookups must be used inside LookupsProvider")
  }
  return use(lookups)
}

/** Each category's colour, by id and by name (charts only have names) */
export const useCategoryColors = () => {
  const { categories } = useLookups()
  return useMemo(() => {
    const byId = new Map<string, CategoryColor>()
    const byName = new Map<string, CategoryColor>()
    for (const c of categories) {
      const color = categoryColor(c)
      byId.set(c.id, color)
      byName.set(c.name, color)
    }
    return { byId, byName }
  }, [categories])
}
