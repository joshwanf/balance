import { Link } from "react-router"
import { SidebarLink } from "./SidebarLink"
export const Sidebar = () => {
  return (
    <div className="pt-4 px-4">
      <div>Logo</div>
      <div className="space-y-2 text-slate-600">
        <SidebarLink to="">Home</SidebarLink>
        <SidebarLink to="budgets">Budgets</SidebarLink>
        <SidebarLink to="transactions">Transactions</SidebarLink>
        <SidebarLink to="accounts">Accounts</SidebarLink>
      </div>
    </div>
  )
}
