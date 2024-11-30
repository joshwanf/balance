import { useState } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { ApiTypes } from "../../types/api"
import { EditableText } from "../../lib/ComponentLibrary/EditableText"
import balance from "../../utils/api"
import { ApiError } from "../../utils/classes/ApiError"
import { removeT } from "../../features/transactionsSlice"
import { AnimatePresence, motion } from "motion/react"
import { Modal } from "../../lib/ComponentLibrary/Modal"
import { ConfirmDelete } from "./ConfirmDelete"
import { changeTransactionThunk } from "../../utils/thunks/transactions"
import { selectCategories } from "../../features/categoriesSlice"
import { DropdownSelector } from "../../lib/ComponentLibrary/DropdownSelector"
import { selectAccounts } from "../../features/accountsSlice"
import { Money } from "../../utils/classes/Money"
import { X } from "lucide-react"
import moment from "moment"

interface FormErrors {
  date?: string
  payee?: string
  amount?: string
}
interface Props {
  t: ApiTypes.Transaction.TSerialized
  closeModal: (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => void
}
export const TransactionDetails: React.FC<Props> = props => {
  const dispatch = useAppDispatch()
  const { t, closeModal, ...rest } = props
  const categories = useAppSelector(selectCategories)
  const accounts = useAppSelector(selectAccounts)

  const tAmount = Money.fromCents(t.amount.toString())
  const [form, setForm] = useState({ ...t, amount: tAmount.format() })
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleChangeForm = (field: string) => async (newValue: string) => {
    const formWithUpdatedData: { id: string; amount?: number } & Record<
      string,
      string
    > = {
      id: t.id,
    }
    if (field === "category") {
      setForm({ ...form, categoryId: newValue })
      const catName = categories[newValue]?.name || ""
      formWithUpdatedData.categoryName = catName
    } else if (field === "account") {
      setForm({ ...form, accountId: newValue })
      formWithUpdatedData.accountId = newValue
    } else if (field === "date") {
      // setForm({ ...form, date: newValue })
      formWithUpdatedData.date = newValue
    } else if (field === "amount") {
      try {
        const newAmount = Money.parse(newValue)
        formWithUpdatedData.amount = newAmount.toInt()
        console.log({ formWithUpdatedData })
      } catch (e) {
        console.log("error in form.amount")
        if (typeof e === "string") {
          return setFormErrors({ amount: e })
        }
      }
    } else {
      formWithUpdatedData[field] = newValue
    }

    const isValidDate = formWithUpdatedData.date
      ? moment(formWithUpdatedData.date).isValid()
      : true
    const isValidPayee = Object.keys(formWithUpdatedData).includes("payee")
      ? formWithUpdatedData.payee.length > 0
      : true
    const isValidAmount = formWithUpdatedData.amount
      ? Money.isValidMoney(formWithUpdatedData.amount.toString())
      : true
    const isValidForm = isValidDate && isValidPayee && isValidAmount
    console.log({ isValidForm })
    const accErrors: FormErrors = {}
    if (!isValidDate) {
      accErrors.date = "Enter a valid date YYYY-MM-DD"
    }
    if (!isValidPayee) {
      accErrors.payee = "Enter a valid payee"
    }
    if (!isValidAmount) {
      accErrors.amount = "Enter a valid amount"
    }
    if (!isValidForm) {
      setFormErrors(accErrors)
    } else {
      setFormErrors({})
      /** change to thunk */
      const res = await dispatch(
        changeTransactionThunk(formWithUpdatedData),
      ).unwrap()
    }
  }
  const handleShowConfirmModal = () => {
    setConfirmDelete(true)
    setShowConfirmDelete(true)
  }
  const handleCloseConfirmModal = () => {
    setConfirmDelete(false)
    setShowConfirmDelete(false)
  }
  const handleDeleteTransaction = async (
    e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>,
  ) => {
    if (confirmDelete) {
      const response = await balance.transaction.remove(t.id)
      if (!(response instanceof ApiError)) {
        dispatch(removeT(t.id))
        setConfirmDelete(false)
      }
    } else {
      setShowConfirmDelete(true)
      setConfirmDelete(true)
    }
  }

  return (
    <motion.div
      animate={{
        x: 20,
        transition: {
          duration: 100,
          default: { type: "spring" },
          opacity: { ease: "linear" },
        },
      }}
    >
      <div className="pt-4 space-y-4">
        <h1>
          Click on a field to change its value. Hit "Enter" or click off to save
          it.
        </h1>
        <div>
          ID: <code className="bg-slate-200 rounded-md p-1">{t.id}</code>
        </div>
        <div className="grid grid-cols-[20%_80%]">
          <div className="mr-2 font-semibold text-right">Account:</div>
          <div className="w-fit">
            <DropdownSelector
              field="account"
              options={Object.values(accounts)}
              disableBlankSelection={true}
              // selected={form.accountId ? accounts[form.accountId].id : ""}
              selected={form.accountId ? form.accountId : ""}
              onChange={handleChangeForm("account")}
            />
          </div>
          <div className="mr-2 font-semibold text-right">Date:</div>
          <div className="w-fit">
            <EditableText
              text={form.date}
              editText={handleChangeForm("date")}
              additionalClasses={["pr-4"]}
            />
            {formErrors.date && <div>{formErrors.date}</div>}
          </div>

          <div className="mr-2 font-semibold text-right">Payee:</div>
          <div className="w-fit">
            <EditableText
              text={form.payee}
              editText={handleChangeForm("payee")}
              additionalClasses={["pr-4"]}
            />
            {formErrors.payee && <div>{formErrors.payee}</div>}
          </div>
          <div className="mr-2 font-semibold text-right">Category:</div>
          <div className="w-fit">
            <DropdownSelector
              field="category"
              options={Object.values(categories)}
              selected={form.categoryId ? categories[form.categoryId]?.id : ""}
              onChange={handleChangeForm("category")}
            />
          </div>
          <div className="mr-2 font-semibold text-right">Amount:</div>
          <div className="w-fit">
            {tAmount.currencySymbol}
            <EditableText
              text={tAmount.format({ noCurrencySymbol: true })}
              editText={handleChangeForm("amount")}
              additionalClasses={["pr-4"]}
            />
            {formErrors.amount && <div>{formErrors.amount}</div>}
          </div>
        </div>
        <div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleShowConfirmModal}
            className="px-6 py-0 my-6 mx-0 flex items-center text-md bg-red-300 hover:bg-red-200 text-red-800 font-semibold rounded-md border-0 ring-0 outline-none"
          >
            <X size={20} />
            <span className="">Delete transaction</span>
          </motion.button>
        </div>
        <AnimatePresence>
          {showConfirmDelete && (
            <Modal
              selector="#confirmActionNode"
              closeModal={handleCloseConfirmModal}
              element={
                <ConfirmDelete
                  closeModal={handleCloseConfirmModal}
                  deleteT={handleDeleteTransaction}
                />
              }
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
