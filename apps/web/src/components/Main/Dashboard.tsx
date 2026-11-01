import {
  ArrowRightLeft,
  ChartNoAxesCombined,
  Scale,
  WalletCards,
} from "lucide-react"
import Link from "next/link"
import { withMonth } from "@/utils/month"

interface Props {
  month: string
}

export const Dashboard = ({ month }: Props) => {
  const tiles = [
    { title: "Budget", to: "/my-balance/budgets", Icon: Scale },
    {
      title: "Transactions",
      to: "/my-balance/transactions",
      Icon: ArrowRightLeft,
    },
    { title: "Accounts", to: "/my-balance/accounts", Icon: WalletCards },
    { title: "Trends", to: "/my-balance/trends", Icon: ChartNoAxesCombined },
  ]
  return (
    // Phones: one column of compact rows, all four above the fold.
    // From sm: a 2x2 grid of tiles, capped so they don't grow huge on wide screens.
    <nav
      aria-label="Sections"
      className="mx-auto grid max-w-3xl grid-cols-1 gap-3 py-2 sm:grid-cols-2 sm:gap-6 sm:py-6"
    >
      {tiles.map(({ title, to, Icon }) => (
        <Link
          key={title}
          href={withMonth(to, month)}
          className="flex items-center gap-4 rounded-xl border-2 border-brand-200 px-5 py-4
            text-xl text-brand-700
            sm:aspect-[4/3] sm:flex-col sm:justify-center sm:gap-3 sm:p-6 sm:text-3xl
            hover:border-brand-400 hover:text-brand-900 hover:shadow-lg hover:shadow-brand-500
            focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-400
            motion-safe:transition-shadow"
        >
          <Icon className="size-8 shrink-0 sm:size-16" />
          <span>{title}</span>
        </Link>
      ))}
    </nav>
  )
}
