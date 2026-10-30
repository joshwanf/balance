"use client"
import { createContext, startTransition, use, useTransition } from "react"

interface UrlTransition {
  /** true while a month or search change is loading */
  isPending: boolean
  startTransition: (action: () => void) => void
}

const UrlTransitionContext = createContext<UrlTransition>({
  isPending: false,
  startTransition,
})

/**
 * One transition shared by everything that rewrites ?month= or ?q=, so the
 * shell can keep the current page on screen, dimmed, until the new data arrives
 * instead of swapping in a skeleton.
 */
export const UrlTransitionProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [isPending, start] = useTransition()
  return (
    <UrlTransitionContext value={{ isPending, startTransition: start }}>
      {children}
    </UrlTransitionContext>
  )
}

export const useUrlTransition = () => use(UrlTransitionContext)
