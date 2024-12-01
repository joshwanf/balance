import { useAppSelector } from "../../app/hooks"
import { selectAccountById } from "../../features/accountsSlice"

interface Props {
  accountId: string
}
export const AccountCard: React.FC<Props> = props => {
  const { accountId, ...rest } = props
  const account = useAppSelector(state => selectAccountById(state, accountId))

  return (
    <div>
      <div className="border-4 border-grass-300 rounded-lg p-4 h-full">
        <div className="text-wrap">
          <span className="font-bold">ID: </span>
          <pre className="text-wrap inline">{account.id}</pre>
        </div>
        <div>
          <span className="font-bold">Name: </span>
          {account.name}
        </div>
        <div>
          <span className="font-bold">Type: </span>
          {account.accountType}
        </div>
      </div>
    </div>
  )
}
