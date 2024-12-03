import { useState } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { m, LazyMotion, domAnimation } from "motion/react"
import { CirclePlus } from "lucide-react"
import { createCategoriesThunk } from "../../utils/thunks/category"
import { ApiError } from "../../utils/classes/ApiError"
import { Money } from "../../utils/classes/Money"
import { FormField } from "../../lib/ComponentLibrary/FormField"
import { PrimaryButton } from "../../lib/Base/Button"
import { Errors } from "../../lib/ComponentLibrary/Errors"

type CreateErrors = { name?: string; amount?: string }
interface Props {
  onAfterSubmitForm?: () => void
}
export const CreateCategory: React.FC<Props> = props => {
  const { onAfterSubmitForm, ...rest } = props
  const emptyForm = { name: "", amount: "" }

  const dispatch = useAppDispatch()
  const curMonth = useAppSelector(state => state.session.settings.curMonth)
  const [form, setForm] = useState(emptyForm)
  const [createErrors, setCreateErrors] = useState<CreateErrors>({})

  const isValidForm = Money.isValidMoney(form.amount) && form.name.length > 0
  const addCatButtonClassnames = isValidForm
    ? "text-grass-700 border-grass-700 hover:border-grass-600"
    : "text-grass-300 border-grass-300"

  const handleChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const field = e.target.name
    setForm({ ...form, [field]: e.target.value })
  }

  const handleSubmitForm = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const isAmountValidNumber = Money.isValidMoney(form.amount)
    const isValidForm = form.name.length > 0 && isAmountValidNumber
    if (isValidForm) {
      const preparedAmount = Money.parse(form.amount).cents
      const preparedForm = {
        name: form.name,
        amount: preparedAmount,
        month: curMonth,
      }
      try {
        const res = await dispatch(createCategoriesThunk(preparedForm)).unwrap()
        setForm(emptyForm)
        if (onAfterSubmitForm) {
          onAfterSubmitForm()
        }
      } catch (e) {
        if (e instanceof ApiError) {
          setCreateErrors({ ...e.err.message })
        }
      }
    } else {
      const accErrors: CreateErrors = {}
      if (form.name.length < 1) {
        accErrors.name = "Name must be filled out"
      }
      if (!/\d+/.test(form.amount)) {
        accErrors.amount = "Amount must be a valid positive dollar amount"
      }
      setCreateErrors(accErrors)
    }
  }
  return (
    <LazyMotion features={domAnimation}>
      <m.div
        key="createCategory"
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
          transition: { height: { duration: 0.2 }, opacity: { duration: 0.2 } },
        }}
        className="align-top shadow-xl
      bg-grass-50 py-6 px-2 rounded-lg border-2 border-grass-600"
      >
        <div className="flex flex-col lg:flex-row lg:space-x-2 w-fit items-center text-sm">
          <div>
            <FormField
              field="name"
              displayText="Name"
              placeholder="Category name..."
              value={form.name}
              onChange={e => handleChangeForm(e)}
            />
            {createErrors.name && <Errors errors={createErrors.name} />}
          </div>
          <div>
            <FormField
              field="amount"
              displayText="Amount"
              placeholder="Amount..."
              value={form.amount}
              onChange={e => handleChangeForm(e)}
            />
            {createErrors.amount && <Errors errors={createErrors.amount} />}
          </div>
          {/* </div> */}
          <div>
            <PrimaryButton
              onClick={handleSubmitForm}
              className={`${addCatButtonClassnames}
              flex items-center
              border-2 border-grass-300 rounded-md px-4`}
            >
              <CirclePlus size={18} />
              Add new category
            </PrimaryButton>
          </div>
        </div>
      </m.div>
    </LazyMotion>
  )
}
