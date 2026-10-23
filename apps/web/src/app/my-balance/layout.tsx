import { Suspense } from "react"
import { redirect } from "next/navigation"
import { Main } from "@/components/Main/Main"
import { getSessionUser } from "@/server/auth"

export default async function MyBalanceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (!(await getSessionUser())) redirect("/")

  // The month and search live in the URL (useSearchParams), which needs a
  // Suspense boundary so the rest of the page can still prerender.
  return (
    <Suspense>
      <Main>{children}</Main>
    </Suspense>
  )
}
