import { Suspense } from "react"
import { Main } from "@/components/Main/Main"

export default function MyBalanceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // The month and search live in the URL (useSearchParams), which needs a
  // Suspense boundary so the rest of the page can still prerender.
  return (
    <Suspense>
      <Main>{children}</Main>
    </Suspense>
  )
}
