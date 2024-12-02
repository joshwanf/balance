import { AnimatePresence, motion } from "motion/react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { addManyAccounts, selectAccountIds } from "../../features/accountsSlice"
import { useEffect, useState } from "react"
import { AccountCard } from "./AccountCard"
import { CreateAccountCard } from "./CreateAccountCard"
import { listAccountsThunk } from "../../utils/thunks/account"

interface Props {}
export const AccountList: React.FC<Props> = props => {
  const [showEdit, setShowEdit] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<string[]>([])
  const dispatch = useAppDispatch()
  const accountIds = useAppSelector(selectAccountIds)
  const curMonth = useAppSelector(state => state.session.settings.curMonth)
  const isDisabledDelete = false

  useEffect(() => {
    const res = dispatch(listAccountsThunk({ startMonth: curMonth })).unwrap()
  }, [])
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
