import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { selectAccountIds } from "../../features/accountsSlice"
import { useEffect } from "react"
import { AccountCard } from "./AccountCard"
import { CreateAccountCard } from "./CreateAccountCard"
import { listAccountsThunk } from "../../utils/thunks/account"

interface Props {}
export const AccountList: React.FC<Props> = props => {
  const dispatch = useAppDispatch()
  const accountIds = useAppSelector(selectAccountIds)
  const curMonth = useAppSelector(state => state.session.settings.curMonth)

  useEffect(() => {
    const res = dispatch(listAccountsThunk({ startMonth: curMonth })).unwrap()
  }, [])

  return (
    <div className="grid grid-cols-3 gap-5">
      {accountIds && accountIds.map(c => <AccountCard key={c} accountId={c} />)}
      <CreateAccountCard onAfterSubmitForm={() => {}} />
    </div>
  )
}
