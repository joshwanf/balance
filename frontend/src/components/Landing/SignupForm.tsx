import { useState } from "react"
import { useAppDispatch } from "../../app/hooks"
import { login } from "../../features/sessionSlice"
import * as Ipt from "../../lib/Base/Input"
import * as Btn from "../../lib/Base/Button"
import { Errors } from "../../lib/ComponentLibrary/Errors"
import balance from "../../utils/api"
import { ApiError } from "../../utils/classes/ApiError"
import { useNavigate } from "react-router"

interface FormErrors {
  firstName?: string
  lastName?: string
  username?: string
  email?: string
  password?: string
  confirmPassword?: string
}
interface Props {
  // setIsLoggedIn: (input: boolean) => void
  closeModal: () => void
}
export const SignupForm: React.FC<Props> = props => {
  const { closeModal, ...rest } = props
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const initialForm = {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  }
  const [form, setForm] = useState(initialForm)
  const [confirmPass, setConfirmPass] = useState("")
  const [errors, setErrors] = useState({})

  const handleChangeForm = (field: string) => (input: string) => {
    setForm({ ...form, [field]: input })
    try {
    } catch (e) {
      console.log(e)
    }
  }

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const isValidFirstname = form.firstName.length > 0
    const isValidLastname = form.lastName.length > 0
    const isValidUsername = form.username.length >= 4
    const isValidPassword = form.password.length >= 6
    const isMatchingPassword = form.password === confirmPass
    const isValidForm = isValidUsername && isValidPassword && isMatchingPassword

    if (!isValidForm) {
      const accErrors: FormErrors = {}
      if (!isValidFirstname) {
        accErrors.firstName = "Please enter a first name"
      }
      if (!isValidLastname) {
        accErrors.lastName = "Please enter a last name"
      }
      if (!isValidUsername) {
        accErrors.username = "Username must be at least 4 characters long"
      }
      if (!isValidPassword) {
        accErrors.password = "Password must be at least 6 characters long"
      }
      if (!isMatchingPassword) {
        accErrors.confirmPassword = "Passwords must match"
      }

      return setErrors(accErrors)
    }

    try {
      const response = await balance.session.create(form)
      if (!(response instanceof ApiError)) {
        dispatch(login(response))
        closeModal()
        navigate("/my-balance")
      }
    } catch (e) {
      if (e instanceof ApiError) {
        console.log(e)
        setErrors(e.err.error)
      }
    }
  }

  return (
    <div className="border-2 bg-white rounded-md p-4 m-6 space-y-2">
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
          type="password"
          onChange={handleChangeForm("password")}
        />
        <p>Confirm Password</p>
        <Ipt.TextInput
          text={confirmPass}
          type="password"
          onChange={setConfirmPass}
        />
        <Btn.PrimaryButton>Sign Up</Btn.PrimaryButton>
      </form>
    </div>
  )
}
