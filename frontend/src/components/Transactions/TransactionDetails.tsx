import { useState } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { ApiTypes } from "../../types/api"
import * as Btn from "../../lib/Base/Button"
import { EditableText } from "../../lib/ComponentLibrary/EditableText"
import { SideModal } from "../../lib/ComponentLibrary/SideModal"
import balance from "../../utils/api"
import { ApiError } from "../../utils/classes/ApiError"
import { removeT } from "../../features/transactionsSlice"
import { AnimatePresence, motion } from "motion/react"
import { createPortal } from "react-dom"
import { Modal } from "../../lib/ComponentLibrary/Modal"
import { ConfirmDelete } from "./ConfirmDelete"
import { changeTransactionThunk } from "../../utils/thunks/transactions"
import { selectCategories } from "../../features/categoriesSlice"
import { DropdownSelector } from "../../lib/ComponentLibrary/DropdownSelector"
import { selectAccounts } from "../../features/accountsSlice"

interface Props {
  t: ApiTypes.Transaction.TSerialized
  closeModal: (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => void
}
export const TransactionDetails: React.FC<Props> = props => {
  const dispatch = useAppDispatch()
  const { t, closeModal, ...rest } = props
  const categories = useAppSelector(selectCategories)
  const accounts = useAppSelector(selectAccounts)
  const [form, setForm] = useState(t)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleChangeForm = (field: string) => async (newValue: string) => {
    console.log("Sending request from TransactionCard for change in", {
      [field]: newValue,
    })
    const formWithUpdatedData: { id: string } & Record<string, string> = {
      id: t.id,
    }
    if (field === "category") {
      console.log(newValue, form)
      setForm({ ...form, categoryId: newValue })
      const catName = categories[newValue]?.name || ""
      formWithUpdatedData.categoryName = catName
    } else {
      formWithUpdatedData[field] = newValue
    }
    console.log(formWithUpdatedData)
    /** change to thunk */
    const res = await dispatch(
      changeTransactionThunk(formWithUpdatedData),
    ).unwrap()
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
        <div>
          ID: <code className="bg-slate-200 rounded-md p-1">{t.id}</code>
        </div>
        <div>
          <span className="mr-2 font-semibold">Account:</span>
          <DropdownSelector
            options={Object.values(accounts)}
            disableBlankSelection={true}
            selected={form.accountId ? accounts[form.accountId].id : ""}
            onChange={handleChangeForm("account")}
          />
        </div>
        <div className="py-2 text-left">
          <span className="mr-2 font-semibold">Date:</span>
          {form.date}
        </div>
        <div>
          <span className="mr-2 font-semibold">Payee:</span>
          <EditableText
            text={form.payee}
            onTextChange={handleChangeForm("payee")}
          />
        </div>
        <div>
          <span className="mr-2 font-semibold">Category:</span>
          <DropdownSelector
            options={Object.values(categories)}
            selected={form.categoryId ? categories[form.categoryId]?.id : ""}
            onChange={handleChangeForm("category")}
          />
        </div>
        <div>
          <span className="mr-2 font-semibold">Amount:</span>
          <EditableText
            text={form.amount.toString()}
            onTextChange={handleChangeForm("amount")}
          />
        </div>
        <div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleShowConfirmModal}
            className="px-6 py-0 my-6 mx-0  bg-red-300 hover:bg-red-200 text-red-800 font-semibold rounded-md border-0 ring-0 outline-none"
          >
            Delete transaction
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
