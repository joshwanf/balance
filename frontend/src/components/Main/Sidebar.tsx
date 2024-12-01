import { Link } from "react-router"
import { SidebarLink } from "./SidebarLink"
import {
  ArrowRightLeft,
  Scale,
  SquareChevronDown,
  WalletCards,
} from "lucide-react"
import { Fragment } from "react/jsx-runtime"
import { useState } from "react"

interface Props {
  hidden: boolean
}
export const Sidebar: React.FC<Props> = props => {
  const { hidden, ...rest } = props
  const [hideSidebar, setHideSidebar] = useState(false)
  return (
    <div className="pt-4 px-4" hidden={hidden}>
      {/* <div onClick={() => setHideSidebar(!hideSidebar)} className="">
        <SquareChevronDown />
      </div> */}
      <div>Logo</div>
      <div hidden={hideSidebar} className="">
        <div className="space-y-2 text-slate-600">
          <SidebarLink to="">Home</SidebarLink>
          <SidebarLink to="budgets">
            <Fragment>
              <Scale className="w-6" />
              <span className="px-2">Budgets</span>
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
    </div>
  )
}
