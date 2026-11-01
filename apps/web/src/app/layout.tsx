import type { Metadata, Viewport } from "next"
import { Figtree } from "next/font/google"
import { THEME_COLOR, THEME_SCRIPT } from "@/theme/theme"
import "./globals.css"

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Balance",
  icons: { icon: "/assets/balance.svg" },
}

// Browser chrome colour: the shell of each theme. A saved light/dark choice
// overrides both (THEME_SCRIPT, setThemeChoice).
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: THEME_COLOR.light },
    { media: "(prefers-color-scheme: dark)", color: THEME_COLOR.dark },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // data-theme is set by THEME_SCRIPT before React hydrates
    <html lang="en" className={figtree.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <div>{children}</div>
        <div id="authNode" className=""></div>
        <div id="transactionDetailNode"></div>
        <div id="confirmActionNode"></div>
      </body>
    </html>
  )
}
