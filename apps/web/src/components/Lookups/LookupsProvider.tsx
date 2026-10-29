"use client"
import { createContext, use } from "react"

export interface Lookup {
  id: string
  name: string
}

export type Lookups = { accounts: Lookup[]; categories: Lookup[] }

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
