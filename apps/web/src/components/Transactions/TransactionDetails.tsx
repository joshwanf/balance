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
import { useLookups } from "@/components/Lookups/LookupsProvider"

interface FormErrors {
  date?: string
  payee?: string
  amount?: string
  invalid?: string
}

interface TransactionFields {
  type: "outgoing" | "incoming"
  date: string
  payee: string
  accountId: string
  categoryId: string
  amount: string
}
interface Props {
  t: ApiTypes.Transaction.TSerialized
  allTags: string[]
  closeModal: (e?: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => void
}
export const TransactionDetails = ({ t, allTags, closeModal }: Props) => {
  const { accounts, categories } = useLookups()
  const tAmount = Money.fromCents(t.amount.toString())
  const [form, setForm] = useState({ ...t, amount: tAmount.format() })
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>(t.tags)

  const handleChangeForm =
    (field: keyof TransactionFields) => async (newValue: string) => {
      const isValidDate =
        field === "date"
          ? validateDate({ date: newValue, format: "YYYY-MM-DD" })
          : true
      const isValidPayee = field === "payee" ? newValue.length > 0 : true
      const isValidAmount =
        field === "amount" ? Money.isValidMoney(newValue) : true
      const isValidForm = isValidDate && isValidPayee && isValidAmount

      if (field === "amount" && !isValidAmount) {
        setFormErrors(prev => ({
          ...prev,
          amount: "Please enter a valid Money amount.",
        }))
      } else if (field === "date" && !isValidDate) {
        setFormErrors(prev => ({
          ...prev,
          date: "Please enter a valid date YYYY-MM-DD.",
        }))
      } else if (field === "payee" && !isValidPayee) {
        setFormErrors(prev => ({
          ...prev,
          payee: "Please enter a valid payee.",
        }))
      }

      if (!isValidForm) return false

      const previous = form[field]
      setForm(prev => ({ ...prev, [field]: newValue }))
      setFormErrors({})
      const valueToSave =
        field === "amount" ? Money.parse(newValue).toInt() : newValue

      const result = await changeTransactionAction(t.id, {
        [field]: valueToSave,
      })

      if (result.status === "error") {
        setForm(prev => ({ ...prev, [field]: previous }))
        setFormErrors({ invalid: result.error })
      }

      return result.status !== "error"
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
          <p className="text-sm text-slate-500">
            Click a field to change it. Press Enter or click away to save, or
            Escape to cancel.
          </p>
          {formErrors.invalid && <Errors errors={formErrors.invalid} />}
          <div>
            ID:{" "}
            <code className="bg-slate-200 rounded-md p-1 text-xs break-all">
              {t.id}
            </code>
          </div>
          {/* labels above fields on phones, beside them from sm */}
          <div className="grid grid-cols-1 gap-y-1 sm:grid-cols-[6rem_minmax(0,1fr)] sm:gap-x-3 sm:gap-y-2 sm:items-center">
            <div className="font-semibold max-sm:mt-2 sm:text-right">Type:</div>
            <div className="flex gap-2">
              {[
                { label: "Outgoing", value: "outgoing" },
                { label: "Incoming", value: "incoming" },
              ].map(({ label, value }) => (
                <label
                  key={value}
                  className={`cursor-pointer rounded-full border-2 px-3 py-0.5 text-sm
                    has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-grass-500
                    ${form.type === value ? "border-grass-600 bg-grass-100 font-semibold text-grass-900" : "border-slate-200 text-slate-500 hover:border-slate-300"}`}
                >
                  <input
                    type="radio"
                    name="type"
                    className="sr-only"
                    checked={form.type === value}
                    value={value}
                    onChange={() => handleChangeForm("type")(value)}
                  />
                  {label}
                </label>
              ))}
            </div>

            <div className="font-semibold max-sm:mt-2 sm:text-right">
              Account:
            </div>
            <div className="w-full">
              <DropdownSelector
                field="accountId"
                options={accounts}
                disableBlankSelection={true}
                selected={form.accountId ? form.accountId : ""}
                onChange={handleChangeForm("accountId")}
                labelId="categorySelector"
              />
            </div>

            <div className="font-semibold max-sm:mt-2 sm:text-right">Date:</div>
            <div className="w-full">
              <EditableText
                text={form.date}
                type="date"
                onFinishEditing={handleChangeForm("date")}
                additionalClasses={["pr-4"]}
              />
              {formErrors.date && <Errors errors={formErrors.date} />}
            </div>

            <div className="font-semibold max-sm:mt-2 sm:text-right">
              Payee:
            </div>
            <div className="">
              <EditableText
                text={form.payee}
                onFinishEditing={handleChangeForm("payee")}
                placeholder="Payee"
                additionalClasses={["pr-4"]}
              />
              {formErrors.payee && <div>{formErrors.payee}</div>}
            </div>

            <div className="font-semibold max-sm:mt-2 sm:text-right">
              Category:
            </div>
            <div className="w-full">
              <DropdownSelector
                field="categoryId"
                options={categories}
                selected={form.categoryId ? form.categoryId : ""}
                onChange={handleChangeForm("categoryId")}
              />
            </div>

            <div className="font-semibold max-sm:mt-2 sm:text-right">
              Amount:
            </div>
            <div className="w-full flex items-center">
              {tAmount.currencySymbol}
              <EditableText
                text={tAmount.format({ noCurrencySymbol: true })}
                type="number"
                onFinishEditing={handleChangeForm("amount")}
                additionalClasses={["pr-4"]}
              />
              {formErrors.amount && <div>{formErrors.amount}</div>}
            </div>

            <div className="font-semibold max-sm:mt-2 sm:text-right">Tags:</div>
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
