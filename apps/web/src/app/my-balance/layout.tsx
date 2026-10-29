import { Suspense } from "react"
import { redirect } from "next/navigation"
import { Main } from "@/components/Main/Main"
import { LookupsProvider } from "@/components/Lookups/LookupsProvider"
import { getSessionUser } from "@/server/auth"
import { listAccountNames } from "@/server/data"
import { listCategoryNames } from "@/server/data"

export default async function MyBalanceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getSessionUser()
  if (!user) redirect("/")

  const lookups = Promise.all([
    listAccountNames(user.id),
    listCategoryNames(user.id),
  ]).then(([accounts, categories]) => ({ accounts, categories }))

  // The month and search live in the URL (useSearchParams), which needs a
  // Suspense boundary so the rest of the page can still prerender.
  return (
    <LookupsProvider lookups={lookups}>
      <Suspense>
        <Main>{children}</Main>
      </Suspense>
    </LookupsProvider>
  )
}
