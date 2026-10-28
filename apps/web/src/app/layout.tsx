import type { Metadata } from "next"
import { Providers } from "@/components/Providers"
import { getSessionUser } from "@/server/auth"
import { getUserWithRelations } from "@/server/data"
import "./globals.css"

export const metadata: Metadata = {
  title: "Balance",
  icons: { icon: "/assets/balance.svg" },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const sessionUser = await getSessionUser()
  const user = sessionUser ? await getUserWithRelations(sessionUser.id) : null

  return (
    <html lang="en">
      <body>
        <Providers key={user?.id ?? "guest"} user={user}>
          <div>{children}</div>
        </Providers>
        <div id="authNode" className=""></div>
        <div id="transactionDetailNode"></div>
        <div id="confirmActionNode"></div>
      </body>
    </html>
  )
}
