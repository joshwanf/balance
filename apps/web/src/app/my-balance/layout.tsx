import { Suspense } from "react"
import type { Viewport } from "next"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Main } from "@/components/Main/Main"
import { SIDEBAR_COOKIE } from "@/components/Main/navLinks"
import { LookupsProvider } from "@/components/Lookups/LookupsProvider"
import { UrlTransitionProvider } from "@/hooks/urlTransition"
import { getSessionUser } from "@/server/auth"
import { listAccountNames } from "@/server/data"
import { listCategoryNames } from "@/server/data"

// browser chrome colour; matches the app shell (bg-slate-200)
export const viewport: Viewport = { themeColor: "#e2e8f0" }

export default async function MyBalanceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getSessionUser()
  if (!user) redirect("/")

  const sidebarCollapsed =
    (await cookies()).get(SIDEBAR_COOKIE)?.value === "collapsed"

  const lookups = Promise.all([
    listAccountNames(user.id),
    listCategoryNames(user.id),
  ]).then(([accounts, categories]) => ({ accounts, categories }))

  // The month and search live in the URL (useSearchParams), which needs a
  // Suspense boundary so the rest of the page can still prerender.
  return (
    <LookupsProvider lookups={lookups}>
      <UrlTransitionProvider>
        <Suspense>
          <Main defaultCollapsed={sidebarCollapsed}>{children}</Main>
        </Suspense>
      </UrlTransitionProvider>
    </LookupsProvider>
  )
}
