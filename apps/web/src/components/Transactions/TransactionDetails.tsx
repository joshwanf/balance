"use client"
import { useState } from "react"
import type { ApiTypes } from "@balance/api-types"
import { EditableText } from "../../lib/ComponentLibrary/EditableText"
import {
  changeTransactionAction,
  deleteTransactionAction,
} from "@/server/actions/transaction"
import { AnimatePresence, m, LazyMotion, domAnimation } from "motion/react"
import { Modal } from "../../lib/ComponentLibrary/Modal"
import { ConfirmDelete } from "./ConfirmDelete"
import { DropdownSelector } from "../../lib/ComponentLibrary/DropdownSelector"
import { Money } from "../../utils/classes/Money"
import { X } from "lucide-react"
import { validateDate } from "../../utils/helpers/date"
import { Errors } from "../../lib/ComponentLibrary/Errors"
import { PrimaryButton } from "../../lib/Base/Button"
import { TagSelector } from "./TagSelector"

interface FormErrors {
  date?: string
  payee?: string
  amount?: string
  invalid?: string
}
interface Props {
  accounts: { id: string; name: string }[]
  categories: { id: string; name: string }[]
  t: ApiTypes.Transaction.TSerialized
  allTags: string[]
  closeModal: (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => void
}
export const TransactionDetails = ({
  accounts,
  categories,
  t,
  allTags,
  closeModal,
}: Props) => {
  const tAmount = Money.fromCents(t.amount.toString())
  const [form, setForm] = useState({ ...t, amount: tAmount.format() })
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>(t.tags)

  const handleChangeForm = (field: string) => async (newValue: string) => {
    const formWithUpdatedData: { amount?: number } & Record<string, string> = {}
    if (field === "type") {
      setForm({ ...form, type: newValue })
      formWithUpdatedData.type = newValue
    } else if (field === "category") {
      setForm({ ...form, categoryId: newValue })
      formWithUpdatedData.categoryId = newValue
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
      } catch (e) {
        if (typeof e === "string") {
          return setFormErrors({ amount: e })
        }
      }
    } else {
      formWithUpdatedData[field] = newValue
    }

    const isValidDate = formWithUpdatedData.date
      ? validateDate({ date: formWithUpdatedData.date, format: "YYYY-MM-DD" })
      : true
    const isValidPayee = Object.keys(formWithUpdatedData).includes("payee")
      ? formWithUpdatedData.payee.length > 0
      : true
    const isValidAmount = formWithUpdatedData.amount
      ? Money.isValidMoney(formWithUpdatedData.amount.toString())
      : true
    const isValidForm = isValidDate && isValidPayee && isValidAmount

    const accErrors: FormErrors = {}
    if (!isValidDate) {
      accErrors.date = "Enter a valid date YYYY-MM-DD after 1970-01-01"
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
      const result = await changeTransactionAction(t.id, formWithUpdatedData)
      if (result.status === "error") setFormErrors({ invalid: result.error })
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
      const result = await deleteTransactionAction(t.id)
      if (result.status === "error") {
        setFormErrors({ invalid: result.error })
      }
      setConfirmDelete(false)
    } else {
      setShowConfirmDelete(true)
      setConfirmDelete(true)
    }
  }

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        animate={{
          transition: {
            duration: 100,
            default: { type: "spring" },
            opacity: { ease: "linear" },
          },
        }}
      >
        <div className="pt-4 space-y-4">
          <h1>
            Click on a field to change its value. Hit "Enter" or click off to
            save it.
          </h1>
          {formErrors.invalid && <Errors errors={formErrors.invalid} />}
          <div>
            ID: <code className="bg-slate-200 rounded-md p-1">{t.id}</code>
          </div>
          <div className="grid grid-cols-[20%_80%]">
            <div className="mr-2 font-semibold text-right">Type:</div>
            <div>
              <div>
                <label htmlFor="outgoing">
                  <input
                    type="radio"
                    id="outgoing"
                    // defaultChecked={form.type === "outgoing"}
                    checked={form.type === "outgoing"}
                    value="outgoing"
                    // onClick={e =>
                    //   setForm({ ...form, type: e.currentTarget.value })
                    // }
                    onChange={() => handleChangeForm("type")("outgoing")}
                  />
                  Outgoing
                </label>
                <label>
                  <input
                    type="radio"
                    checked={form.type === "incoming"}
                    value="incoming"
                    onChange={() => handleChangeForm("type")("incoming")}
                  />
                  Incoming
                </label>
              </div>
            </div>
            <div className="mr-2 font-semibold text-right">Account:</div>
            {/* <div className="w-fit"> */}
            <DropdownSelector
              field="account"
              options={accounts}
              disableBlankSelection={true}
              selected={form.accountId ? form.accountId : ""}
              onChange={handleChangeForm("account")}
              labelId="categorySelector"
            />
            {/* </div> */}
            <div className="mr-2 font-semibold text-right">Date:</div>
            <div className="w-fit">
              <EditableText
                text={form.date}
                editText={handleChangeForm("date")}
                additionalClasses={["pr-4"]}
              />
              {formErrors.date && <Errors errors={formErrors.date} />}
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
                options={categories}
                selected={form.categoryId ? form.categoryId : ""}
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
            <div className="mr-2 font-semibold text-right">Tags:</div>
            {/* <div className="w-fit"> */}
            {/* <InputWithSelector
              list={fakeTags}
              selected={selectedTags}
              setSelected={setSelectedTags}
            /> */}
            <TagSelector
              transactionId={t.id}
              transactionTags={t.tags}
              allTags={allTags}
            />
            {/* </div> */}
          </div>
          <div>
            <PrimaryButton
              onClick={handleShowConfirmModal}
              additionalClasses={[
                "px-6 py-0 my-6 mx-0 flex items-center text-md font-semibold rounded-md border-0 ring-0 outline-none active:bg-red-200 active:border-red-200",
              ]}
              classSchema={{
                bgColor: "bg-red-300",
                hoverBgColor: "hover:bg-red-200",
                borderColor: "border-red-300",
                hoverBorderColor: "hover:border-red-200",
                textColor: "text-red-800",
              }}
            >
              <X size={20} />
              <span className="">Delete transaction</span>
            </PrimaryButton>
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
      </m.div>
    </LazyMotion>
  )
}
