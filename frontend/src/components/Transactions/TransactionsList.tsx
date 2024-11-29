import { useEffect, useState } from "react"
import { useAppSelector, useAppDispatch } from "../../app/hooks"
import { selectUser } from "../../features/sessionSlice"
import balance from "../../utils/api"
import { ApiTypes } from "../../types/api"
import { TransactionCard } from "./TransactionCard"
import {
  addManyTs,
  selectTArr,
  memoizedSelectTArr,
  selectTransactions,
} from "../../features/transactionsSlice"
import { addManyCategories } from "../../features/categoriesSlice"
import { ApiError } from "../../utils/classes/ApiError"
import { listTransactionsThunk } from "../../utils/thunks/transactions"
import { CreateTransaction } from "./CreateTransaction"
import { AnimatePresence, motion } from "motion/react"

type Transaction = ApiTypes.Transaction.ListResponse

export const TransactionsList: React.FC = () => {
  const dispatch = useAppDispatch()
  const session = useAppSelector(state => state.session)
  const {
    user,
    settings: { curMonth },
  } = session
  // const transactions = useAppSelector(state => memoizedSelectTArr(state))
  // const transactions = useAppSelector(selectTransactions)
  const transactions = useAppSelector(memoizedSelectTArr)
  const allTransIds = transactions.map(t => t.id)
  const [selectedItem, setSelectedItem] = useState<string[]>([])
  const [showAddItem, setShowAddItem] = useState(false)
  const [checkAllItems, setCheckAllItems] = useState(false)

  // const allTransIds = Object.values(transactions).map(t => t.id)
  const handleSelectItem =
    (id: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      e.stopPropagation()
      if (e.target.checked) {
        setSelectedItem([...selectedItem, id])
      } else {
        const nextSelectedItems = selectedItem.filter(i => i !== id)
        setSelectedItem(nextSelectedItems)
      }
    }

  const handleSelectAllItems = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    if (e.target.checked) {
      setSelectedItem(allTransIds)
      setCheckAllItems(true)
    } else {
      setSelectedItem([])
      setCheckAllItems(false)
    }
  }
  useEffect(() => {
    dispatch(listTransactionsThunk({ startMonth: curMonth }))
  }, [dispatch, listTransactionsThunk])

  if (!user) {
    return <h1>Must be logged in!</h1>
  }
  // if (!transactions) {
  //   return <h1>Loading transactions</h1>
  // }

  return (
    <div>
      <div
        className="flex flex-col justify-between bg-grass-100
      px-4 py-4 rounded-2xl"
      >
        <div className="flex flex-row justify-around">
          <div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={e => setShowAddItem(!showAddItem)}
              className={`
                px-4 rounded-md border-2 
              ${!showAddItem ? "bg-grass-700" : "bg-grass-300"}
              ${!showAddItem ? "text-grass-200" : "text-grass-800"}
              ${!showAddItem ? "border-grass-700" : "border-grass-800"}
              `}
            >
              Add Transaction
            </motion.button>
          </div>
          <div>Edit Transaction</div>
          <div>Filter</div>
          <div>Search</div>
        </div>
        <AnimatePresence>
          {showAddItem && (
            <CreateTransaction
              onAfterSubmitForm={() => setShowAddItem(false)}
            />
          )}
        </AnimatePresence>
      </div>

      <table className=" w-full border-collapse">
        <thead>
          <tr>
            <th className="py-2 pl-2 text-left">
              <input
                type="checkbox"
                checked={checkAllItems}
                onChange={handleSelectAllItems}
                onClick={e => e.stopPropagation()}
              />
            </th>
            <th className="py-2 text-left">Date</th>
            <th className="py-2 text-left">Payee</th>
            <th className="py-2 text-left">Account</th>
            <th className="py-2 text-left">Amount</th>
            <th className="py-2 text-left">Category</th>
          </tr>
        </thead>
        <tbody className="space-y-40">
          {transactions &&
            Object.values(transactions).map(t => (
              <TransactionCard
                key={t.id}
                t={t}
                checked={selectedItem.includes(t.id)}
                onChange={handleSelectItem(t.id)}
              />
            ))}
          {transactions &&
            Object.values(transactions).map(t => (
              <TransactionCard
                key={t.id}
                t={t}
                checked={selectedItem.includes(t.id)}
                onChange={handleSelectItem(t.id)}
              />
            ))}
        </tbody>
      </table>
    </div>
  )
}
