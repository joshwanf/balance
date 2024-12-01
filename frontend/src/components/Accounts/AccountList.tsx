import { AnimatePresence, motion } from "motion/react"
import { useAppSelector } from "../../app/hooks"
import { selectAccountIds } from "../../features/accountsSlice"
import { useState } from "react"
import { AccountCard } from "./AccountCard"
import { CreateAccount } from "./CreateAccount"

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
        <div
          className="flex flex-col justify-between bg-grass-100 space-y-2
          px-4 py-4 rounded-2xl"
        >
          <div className="flex flex-row justify-around">
            <div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={e => setShowEdit(!showEdit)}
                className={`
                    px-4 rounded-md border-2 
                  ${!showEdit ? "bg-grass-700" : "bg-grass-300"}
                  ${!showEdit ? "text-grass-200" : "text-grass-800"}
                  ${!showEdit ? "border-grass-700" : "border-grass-800"}
                  `}
              >
                Add Category
              </motion.button>
            </div>
            <div>
              <motion.button
                whileTap={isDisabledDelete ? {} : { scale: 0.95 }}
                disabled={isDisabledDelete}
                onClick={handleDeleteAccount}
                className={`px-4 rounded-md border-2 
                  ${isDisabledDelete ? "bg-grass-200" : "bg-grass-700"}
                  ${isDisabledDelete ? "text-grass-600" : "text-grass-200"}
                  ${isDisabledDelete ? "border-grass-200" : "border-grass-700"}
                  `}
              >
                Delete {selectedAccount.length <= 1 ? "category" : "categories"}
              </motion.button>
            </div>
            <div>Search</div>
          </div>
          <AnimatePresence>
            {showEdit && (
              <CreateAccount onAfterSubmitForm={() => setShowEdit(false)} />
            )}
          </AnimatePresence>
        </div>
        <div className="grid grid-cols-3 gap-5">
          {accountIds &&
            accountIds.map(c => <AccountCard key={c} accountId={c} />)}
          <CreateAccount onAfterSubmitForm={() => {}} />
        </div>
      </div>
    </div>
  )
}
