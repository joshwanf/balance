import { SidebarLink } from "./SidebarLink"
import {
  ArrowRightLeft,
  ChartNoAxesCombined,
  LayoutGrid,
  Scale,
  WalletCards,
} from "lucide-react"
import { useState } from "react"

interface Props {
  hidden?: boolean
}
export const Sidebar: React.FC<Props> = props => {
  const { hidden, ...rest } = props
  const [hideSidebar, setHideSidebar] = useState(false)
  return (
    <div className="pt-4 px-4 flex flex-col items-start" hidden={hidden}>
      <div>Logo</div>
      <div hidden={hideSidebar} className="w-full">
        <div className="space-y-2 text-slate-600">
          <SidebarLink to="">
            <>
              <LayoutGrid className="w-6" />
              <span className="px-2">Home</span>
            </>
          </SidebarLink>
          <SidebarLink to="budgets">
            <>
              <Scale className="w-6" />
              <span className="px-2">Budgets</span>
            </>
          </SidebarLink>
          <SidebarLink to="transactions">
            <>
              <ArrowRightLeft className="w-6" />
              <span className="pl-2">Transactions</span>
            </>
          </SidebarLink>
          <SidebarLink to="accounts">
            <>
              <WalletCards className="w-6" />
              <span className="pl-2">Accounts</span>
            </>
          </SidebarLink>
          <SidebarLink to="trends">
            <>
              <ChartNoAxesCombined className="w-6" />
              <span className="pl-2">Trends</span>
            </>
          </SidebarLink>
        </div>
      </div>
    </div>
  )
}
