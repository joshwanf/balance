import { AnimatePresence, motion } from "motion/react"
import { useAppSelector } from "../../app/hooks"
import { selectAccountIds } from "../../features/accountsSlice"
import { useState } from "react"
import { AccountCard } from "./AccountCard"
import { CreateAccountCard } from "./CreateAccountCard"

interface Props {}
export const AccountList: React.FC<Props> = props => {
  const [showEdit, setShowEdit] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<string[]>([])
  const accountIds = useAppSelector(selectAccountIds)

  const isDisabledDelete = false

  const handleDeleteAccount = () => {}
  return (
    <div>
      <div>
        <div className="grid grid-cols-3 gap-5">
          {accountIds &&
            accountIds.map(c => <AccountCard key={c} accountId={c} />)}
          <CreateAccountCard onAfterSubmitForm={() => {}} />
        </div>
      </div>
    </div>
  )
}
