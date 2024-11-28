import { useState } from "react"
import { useAppDispatch } from "../../app/hooks"
import { login } from "../../features/sessionSlice"
import * as Ipt from "../../lib/Base/Input"
import * as Btn from "../../lib/Base/Button"
import { Errors } from "../../lib/ComponentLibrary/Errors"
import balance from "../../utils/api"
import { ApiError } from "../../utils/classes/ApiError"

interface Props {
  // setIsLoggedIn: (input: boolean) => void
  closeModal: () => void
}
export const SignupForm: React.FC<Props> = props => {
  const { closeModal, ...rest } = props
  const dispatch = useAppDispatch()
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  })
  const [confirmPass, setConfirmPass] = useState("")
  const [errors, setErrors] = useState<string | null>(null)

  const handleChangeForm = (field: string) => (input: string) => {
    setForm({ ...form, [field]: input })
    try {
    } catch (e) {
      console.log(e)
    }
  }

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors(null)
    console.log({ form })
    /** validate form fields */
    try {
      const response = await balance.session.signup(form)
      if (!(response instanceof ApiError)) {
        dispatch(login(response))
        closeModal()
      }
    } catch (e) {
      console.log(e)
      if (e instanceof ApiError) {
        setErrors(e.err.message)
      }
    }
  }
  return (
    <div className="border-2 bg-white  rounded-md p-4 m-6 space-y-2">
      {errors && <Errors errors={errors} />}
      <form onSubmit={handleSignUp}>
        <div>
          <div>
            <p>First name</p>
            <Ipt.TextInput
              text={form.firstName}
              onChange={handleChangeForm("firstName")}
            />
          </div>
          <div>
            <p>Last name</p>
            <Ipt.TextInput
              text={form.lastName}
              onChange={handleChangeForm("lastName")}
            />
          </div>
        </div>
        <div>
          <p>Username</p>
          <Ipt.TextInput
            text={form.username}
            onChange={handleChangeForm("username")}
          />
        </div>
        <p>Email</p>
        <Ipt.TextInput text={form.email} onChange={handleChangeForm("email")} />
        <p>Password</p>
        <Ipt.TextInput
          text={form.password}
          onChange={handleChangeForm("password")}
        />
        <p>Confirm Password</p>
        <Ipt.TextInput text={confirmPass} onChange={setConfirmPass} />
        <Btn.PrimaryButton>Sign Up</Btn.PrimaryButton>
      </form>
    </div>
  )
}
