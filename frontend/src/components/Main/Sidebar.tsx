import { Link } from "react-router"
import { SidebarLink } from "./SidebarLink"
import { ArrowRightLeft, Scale, WalletCards } from "lucide-react"
import { Fragment } from "react/jsx-runtime"
export const Sidebar = () => {
  return (
    <div className="pt-4 px-4">
      <div>Logo</div>
      <div className="space-y-2 text-slate-600">
        <SidebarLink to="">Home</SidebarLink>
        <SidebarLink to="budgets">
          <Fragment>
            <Scale className="w-6" />
            <span className="pl-2">Budgets</span>
          </Fragment>
        </SidebarLink>
        <SidebarLink to="transactions">
          <Fragment>
            <ArrowRightLeft className="w-6" />
            <span className="pl-2">Transactions</span>
          </Fragment>
        </SidebarLink>
        <SidebarLink to="accounts">
          <Fragment>
            <WalletCards className="w-6" />
            <span className="pl-2">Accounts</span>
          </Fragment>
        </SidebarLink>
      </div>
    </div>
  )
}
