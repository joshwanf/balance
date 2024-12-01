import { useState } from "react"
import { TextInput } from "../../lib/Base/Input"
import { X } from "lucide-react"
import { Money } from "../../utils/classes/Money"
import { useAppDispatch } from "../../app/hooks"
import { createAccountThunk } from "../../utils/thunks/account"
import * as Btn from "../../lib/Base/Button"

interface FormErrors {
  name?: string
  balance?: string
}
interface Props {
  closeForm?: () => void
}
export const CreateAccountForm: React.FC<Props> = props => {
  const { closeForm, ...rest } = props
  const dispatch = useAppDispatch()
  const [form, setForm] = useState({ name: "", type: "", initialBalance: "" })
  const [acctName, setAcctName] = useState("")
  const [acctType, setAcctType] = useState("checking")
  const [acctBalance, setAcctBalance] = useState("")
  const [formErrors, setFormErrors] = useState<FormErrors>({})

  const handleSubmitForm = async () => {
    /** prepare form fields for submitting */
    const isValidBalance = Money.isValidMoney(acctBalance || "0")
    const isValidName = acctName.length > 0
    console.log(isValidBalance)

    const isValidForm = isValidName && isValidBalance
    if (!isValidForm) {
      const accErrors: FormErrors = {}
      if (!isValidBalance) {
        accErrors.balance = "Must be a valid money"
      }
      if (!isValidName) {
        accErrors.name = "Must have a name"
      }
      setFormErrors(accErrors)
    } else {
      setFormErrors({})
      const pBalance = acctBalance ? Money.parse(acctBalance) : Money.parse("0")
      const pForm = {
        name: acctName,
        accountType: acctType,
        initialBalance: pBalance.toInt(),
      }
      console.log({ pForm })
      await dispatch(createAccountThunk(pForm))
      if (closeForm) {
        closeForm()
      }
    }
  }
  return (
    <div onClick={e => e.stopPropagation()} className="relative p-4 w-full">
      <div
        className="absolute right-1 top-1 rounded-md p-1
        text-grass-400
        hover:cursor-pointer hover:bg-grass-200 hover:text-grass-700"
        onClick={closeForm}
      >
        <X />
      </div>
      <div>
        <div>Name: {formErrors.name && <span>{formErrors.name}</span>}</div>
        <TextInput text={acctName} onChange={setAcctName} />
      </div>
      <div>
        Type:
        <div className="space-x-2">
          <label>
            <input
              type="radio"
              name="accountType"
              value="checking"
              checked={acctType === "checking"}
              onChange={e => setAcctType(e.target.value)}
            />
            Checking
          </label>
          <label>
            <input
              type="radio"
              name="accountType"
              value="savings"
              checked={acctType === "savings"}
              onChange={e => setAcctType(e.target.value)}
            />
            Savings
          </label>
        </div>
      </div>
      <div>
        <div>
          Initial balance:{" "}
          {formErrors.balance && <span>{formErrors.balance}</span>}
        </div>
        <TextInput text={acctBalance} onChange={setAcctBalance} />
      </div>
      <div>
        <Btn.PrimaryButton
          additionalClasses={["py-1", "px-2", "bg-grass-50"]}
          onClick={handleSubmitForm}
        >
          Add new account
        </Btn.PrimaryButton>
      </div>
    </div>
  )
}
