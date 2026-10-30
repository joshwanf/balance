import {
  ArrowRightLeft,
  ChartNoAxesCombined,
  LayoutGrid,
  Scale,
  WalletCards,
} from "lucide-react"

/** The my-balance sections, shared by the sidebar, the phone drawer and the top bar title. */
export const NAV_LINKS = [
  { to: "/my-balance", label: "Home", Icon: LayoutGrid, end: true },
  { to: "/my-balance/budgets", label: "Budgets", Icon: Scale },
  {
    to: "/my-balance/transactions",
    label: "Transactions",
    Icon: ArrowRightLeft,
  },
  { to: "/my-balance/accounts", label: "Accounts", Icon: WalletCards },
  { to: "/my-balance/trends", label: "Trends", Icon: ChartNoAxesCombined },
]

/** Mirrors react-router NavLink matching; `end` matches the path exactly */
export const isActivePath = (
  pathname: string | null,
  to: string,
  end = false,
) => pathname === to || (!end && (pathname?.startsWith(to + "/") ?? false))

/** Label of the section the pathname is in, for the phone top bar. */
export const sectionLabel = (pathname: string | null) =>
  NAV_LINKS.find(l => isActivePath(pathname, l.to, l.end))?.label ?? "Balance"

/** Cookie that remembers the collapsed desktop sidebar, read by the layout. */
export const SIDEBAR_COOKIE = "sidebar"
