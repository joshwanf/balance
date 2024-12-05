import { useState } from "react"
import { FormField } from "../../lib/ComponentLibrary/FormField"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { selectCategories } from "../../features/categoriesSlice"
import { DropdownSelector } from "../../lib/ComponentLibrary/DropdownSelector"
import { memoizedSelectAArr } from "../../features/accountsSlice"
import { createTransaction } from "../../utils/thunks/transactions"
import { m, LazyMotion, domAnimation } from "motion/react"
import { Money } from "../../utils/classes/Money"
import { validateDate } from "../../utils/helpers/date"
import { Errors } from "../../lib/ComponentLibrary/Errors"
import dayjs from "dayjs"

type CreateErrors = {
  account?: string
  date?: string
  payee?: string
  amount?: string
}
interface Props {
  onAfterSubmitForm?: () => void
}
export const CreateTransaction: React.FC<Props> = props => {
  const { onAfterSubmitForm, ...rest } = props
  const emptyForm = { date: "", payee: "", amount: "" }
  const dispatch = useAppDispatch()
  const [form, setForm] = useState(emptyForm)
  const categories = useAppSelector(selectCategories)
  const accounts = useAppSelector(state => memoizedSelectAArr(state))
  const [selectedCat, setSelectedCat] = useState<string>("")
  const [selectedAcct, setSelectedAcct] = useState<string>(
    accounts[0]?.id || "",
  )
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
    const isValidAccount = selectedAcct.length > 0
    const isValidDate = validateDate({ date: form.date, format: "YYYY-MM-DD" })
    const isValidMoney = Money.isValidMoney(form.amount)
    const isValidForm =
      isValidAccount && isValidDate && isValidMoney && form.payee.length > 0

    if (isValidForm) {
      const preparedAmount = Money.parse(form.amount).toInt()
      const preparedDate = dayjs(form.date, "YYYY-MM-DD").format("YYYY-MM-DD")
      const preparedAccount = selectedAcct
      const preparedCatName = selectedCat
        ? categories[selectedCat].name
        : undefined

      const preparedForm = {
        ...form,
        type: "outgoing",
        date: preparedDate,
        amount: preparedAmount,
        accountId: preparedAccount,
        categoryName: preparedCatName,
      }

      try {
        const res = await dispatch(createTransaction(preparedForm)).unwrap()
        setForm(emptyForm)
        if (onAfterSubmitForm) {
          setCreateErrors({})
          onAfterSubmitForm()
        }
      } catch (e) {}
    } else {
      const accErrors: CreateErrors = {}
      if (!isValidAccount) {
        accErrors.account = "Select or create an account"
      }
      if (!isValidDate) {
        accErrors.date = "Date must be YYYY-MM-DD and after 1970-01-01"
      }
      if (form.payee.length < 1) {
        accErrors.payee = "Payee must be filled out"
      }
      if (!isValidMoney) {
        accErrors.amount = "Amount must be a valid dollar amount"
      }

      setCreateErrors(accErrors)
    }
  }

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        key="createTransaction"
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: "auto",
          opacity: 1,
          transition: {
            height: { duration: 0.2 },
            opacity: { duration: 0.1, delay: 0.2 },
          },
        }}
        exit={{
          height: 0,
          opacity: 0,
          transition: { height: { duration: 0.1 } },
        }}
        className="align-top shadow-xl
      bg-grass-50 py-6 px-2 rounded-lg border-2 border-grass-600"
      >
        {/* <div className="flex flex-col md:flex-col lg:flex-col xl:flex-row lg:space-x-2 text-sm"> */}
        <div className="grid grid-cols-2 text-sm">
          <FormField
            field="date"
            displayText="Date"
            placeholder="YYYY-MM-DD"
            value={form.date}
            onChange={e => handleChangeForm(e)}
          />
          {createErrors.date ? (
            <Errors errors={createErrors.date} />
          ) : (
            <div></div>
          )}
          <FormField
            field="payee"
            displayText="Payee"
            placeholder="Payee"
            value={form.payee}
            onChange={e => handleChangeForm(e)}
          />
          {createErrors.payee ? (
            <Errors errors={createErrors.payee} />
          ) : (
            <div></div>
          )}
          <DropdownSelector
            field="account"
            options={accounts}
            displayText="Account"
            disableBlankSelection={true}
            selected={selectedAcct}
            onChange={setSelectedAcct}
          />
          {createErrors.account ? (
            <Errors errors={createErrors.account} />
          ) : (
            <div></div>
          )}
          <FormField
            field="amount"
            displayText="Amount"
            placeholder="Amount"
            value={form.amount}
            onChange={e => handleChangeForm(e)}
          />
          {createErrors.amount ? (
            <Errors errors={createErrors.amount} />
          ) : (
            <div></div>
          )}
          <DropdownSelector
            field="category"
            displayText="Category"
            options={Object.values(categories)}
            selected={selectedCat}
            onChange={handleChangeCat}
          />
        </div>
        <div>
          <button onClick={handleSubmitForm}>Add transaction</button>
        </div>
      </m.div>
    </LazyMotion>
  )
}
