import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Balance",
  icons: { icon: "/assets/balance.svg" },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div>{children}</div>
        <div id="authNode" className=""></div>
        <div id="transactionDetailNode"></div>
        <div id="confirmActionNode"></div>
      </body>
    </html>
  )
}
