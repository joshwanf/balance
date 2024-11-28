import { useState } from "react"
import { FormField } from "./FormField"
import { CategorySelector } from "./CategorySelector"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { selectCategories } from "../../features/categoriesSlice"
import { DropdownSelector } from "../../lib/ComponentLibrary/DropdownSelector"
import {
  memoizedSelectAArr,
  selectAccounts,
} from "../../features/accountsSlice"
import { createTransaction } from "../../utils/thunks/transactions"
import { ApiTypes } from "../../types/api"
import { AnimatePresence, motion } from "motion/react"

type Account = { id: string; name: string }
type CreateErrors = { date?: string; payee?: string; amount?: string }
interface Props {
  onAfterSubmitForm?: () => void
}
export const CreateTransaction: React.FC<Props> = props => {
  const { onAfterSubmitForm, ...rest } = props
  const emptyForm = { date: "", payee: "", amount: "" }
  const dispatch = useAppDispatch()
  const [form, setForm] = useState(emptyForm)
  const categories = useAppSelector(selectCategories)
  // const accounts = useAppSelector(selectAccounts)
  const accounts = useAppSelector(state => memoizedSelectAArr(state))
  const [selectedCat, setSelectedCat] = useState<string>("")
  const [selectedAcct, setSelectedAcct] = useState<Account>(accounts[0])
  const [createErrors, setCreateErrors] = useState<CreateErrors>({})

  const handleChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const field = e.target.name
    setForm({ ...form, [field]: e.target.value })
  }
  const handleChangeCat = (id: string) => {
    setSelectedCat(id)
  }

  const handleSubmitForm = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    console.log(/\d{4}-\d{2}-\d{2}/g.test(form.date))
    const isValidForm =
      selectedAcct &&
      /\d{4}-\d{2}-\d{2}/g.test(form.date) &&
      form.payee.length > 0
    if (isValidForm) {
      // const preparedAccount = accounts[selectedAcct].id
      const preparedAccount = selectedAcct.id

      const preparedCatName = selectedCat
        ? categories[selectedCat].name
        : undefined
      const preparedForm = {
        type: "outgoing",
        ...form,
        amount: Number(form.amount),
        accountId: preparedAccount,
        categoryName: preparedCatName,
      }
      console.log(preparedForm)
      try {
        const res = await dispatch(createTransaction(preparedForm)).unwrap()
        console.log(res)
        setForm(emptyForm)
        if (onAfterSubmitForm) {
          // onAfterSubmitForm()
        }
      } catch (e) {}
    } else {
      const accErrors: CreateErrors = {}
      if (!/\d{4}-\d{2}-\d{2}/g.test(form.date)) {
        accErrors.date = "Date must be YYYY-MM-DD"
      }
      if (form.payee.length < 1) {
        accErrors.payee = "Payee must be filled out"
      }
      if (!/\d+\.\d{2}/.test(form.amount)) {
        accErrors.amount = "Amount must be a valid dollar amount"
      }
      setCreateErrors(accErrors)
    }
  }
  return (
    <motion.div
      key="form"
      initial={{ y: "-100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "-100%", opacity: 0 }}
      className="bg-grass-100 align-top"
    >
      <div
        className="flex py-6 space-x-2 text-sm
      bg-grass-50 px-2 rounded-lg border-2 border-grass-600"
      >
        <div className="w-1/5">
          <FormField
            field="date"
            placeholder="YYYY-MM-DD"
            value={form.date}
            onChange={e => handleChangeForm(e)}
          />
          {createErrors.date && <div>{createErrors.date}</div>}
        </div>
        <div className="w-1/5">
          <FormField
            field="payee"
            placeholder="Payee"
            value={form.payee}
            onChange={e => handleChangeForm(e)}
          />
          {createErrors.payee && <div>{createErrors.payee}</div>}
        </div>
        <div className="w-1/5">
          <DropdownSelector
            options={accounts}
            disableBlankSelection={true}
            selected={selectedAcct.name}
            onChange={setSelectedAcct}
          />
        </div>
        <div className="w-1/5">
          <FormField
            field="amount"
            placeholder="Amount"
            value={form.amount}
            onChange={e => handleChangeForm(e)}
          />
          {createErrors.amount && <div>{createErrors.amount}</div>}
        </div>
        <div className="w-1/5">
          <DropdownSelector
            options={Object.values(categories)}
            selected={selectedCat}
            onChange={handleChangeCat}
          />
        </div>
      </div>
      <div>
        <button onClick={handleSubmitForm}>Add transaction</button>
      </div>
    </motion.div>
  )
}
