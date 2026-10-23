"use client"
import { useCurMonth } from "../../hooks/useUrlState"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { selectAccounts } from "../../features/accountsSlice"
import { useEffect } from "react"
import { AccountCard } from "./AccountCard"
import { CreateAccountCard } from "./CreateAccountCard"
import { listAccountsThunk } from "../../utils/thunks/account"

interface Props {}
export const AccountList = ({}: Props) => {
  const dispatch = useAppDispatch()
  // const accountIds = useAppSelector(selectAccountIds)
  const accountIds = Object.keys(useAppSelector(selectAccounts))
  const curMonth = useCurMonth()

  useEffect(() => {
    dispatch(listAccountsThunk({ startMonth: curMonth }))
  }, [dispatch, curMonth])

  return (
    <div className="grid grid-cols-3 gap-5">
      {accountIds && accountIds.map(c => <AccountCard key={c} accountId={c} />)}
      <CreateAccountCard onAfterSubmitForm={() => {}} />
    </div>
  )
}
