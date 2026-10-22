"use client"
import {
  ArrowRightLeft,
  ChartNoAxesCombined,
  Scale,
  WalletCards,
} from "lucide-react"
import Link from "next/link"

interface Props {}
export const Dashboard = ({}: Props) => {
  const tiles = [
    {
      title: "Budget",
      to: "/my-balance/budgets",
      element: <Scale size={64} />,
    },
    {
      title: "Transactions",
      to: "/my-balance/transactions",
      element: <ArrowRightLeft size={64} />,
    },
    {
      title: "Accounts",
      to: "/my-balance/accounts",
      element: <WalletCards size={64} />,
    },
    {
      title: "Trends",
      to: "/my-balance/trends",
      element: <ChartNoAxesCombined size={64} />,
    },
  ]
  return (
    <div className="flex justify-around">
      <div className="grid grid-cols-2 h-[75vh] w-[50vw] p-10 gap-8 justify-center items-center justify-items-center">
        {tiles.map(t => (
          <Link
            key={t.title}
            href={t.to}
            className="border-[0.2em] border-grass-200 rounded-[0.7em] p-8 w-full h-full
          text-4xl text-grass-700 hover:text-grass-900
      hover:border-grass-400 hover:cursor-pointer hover:shadow-lg hover:shadow-grass-500
      flex flex-col justify-center items-center"
          >
            <div className="">{t.element}</div>
            <div>{t.title}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
