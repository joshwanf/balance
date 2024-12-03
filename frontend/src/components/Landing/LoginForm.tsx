import { useState } from "react"
import { useAppDispatch } from "../../app/hooks"
import { useNavigate } from "react-router"
import * as Ipt from "../../lib/Base/Input"
// import * as Btn from "../../lib/Base/Button"
import { PrimaryButton, TertiaryButton } from "../../lib/Base/Button"
import { Errors } from "../../lib/ComponentLibrary/Errors"
import { loginDemoThunk, loginThunk } from "../../utils/thunks/session"
import { ApiError } from "../../utils/classes/ApiError"

interface FormErrors {
  credential?: string
  password?: string
  invalid?: string
}
interface Props {
  closeModal?: () => void
}
export const LoginForm: React.FC<Props> = ({ closeModal }) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [form, setForm] = useState({ credential: "", password: "" })
  const [errors, setErrors] = useState<FormErrors>({})
  const handleChangeForm = (field: string) => (input: string) => {
    setForm({ ...form, [field]: input })
  }
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const isValidCredential = form.credential.length >= 4
    const isValidPassword = form.password.length >= 6
    const isValidForm = isValidCredential && isValidPassword
    if (isValidForm) {
      try {
        const res = await dispatch(loginThunk(form)).unwrap()
        // const categories = await dispatch(listCategoriesThunk()).unwrap()
        setErrors({})
        if (closeModal) {
          closeModal()
          navigate("/my-balance")
        }
      } catch (e) {
        if (typeof e === "string") {
          setErrors({ invalid: e })
        }
      }
    } else {
      const accErrors: FormErrors = {}
      if (!isValidCredential) {
        accErrors.credential = "Credentials must be at least 4 characters long"
      }
      if (!isValidPassword) {
        accErrors.password = "Password must be at least 6 characters long"
      }
      setErrors(accErrors)
    }
  }
  const handleLoginDemo = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const res = await dispatch(loginDemoThunk()).unwrap()
    setErrors({})
    // const categories = await dispatch(listCategoriesThunk()).unwrap()
    if (closeModal) {
      closeModal()
      navigate("/my-balance")
    }
  }

  return (
    <div>
      <div className="bg-white border-0 border-slate-300 rounded-md p-4 m-6 space-y-2">
        {errors.invalid && <Errors errors={errors.invalid} />}
        <form className="space-y-2" onSubmit={handleLogin}>
          <p>Email/username</p>
          {errors.credential && <Errors errors={errors.credential} />}
          <Ipt.TextInput
            text={form.credential}
            onChange={handleChangeForm("credential")}
          />
          <p>Password</p>
          {errors.password && <Errors errors={errors.password} />}
          <Ipt.TextInput
            text={form.password}
            onChange={handleChangeForm("password")}
          />
          <PrimaryButton>Log In</PrimaryButton>
        </form>
        <TertiaryButton onClick={handleLoginDemo}>
          Log in as demo user
        </TertiaryButton>
      </div>
    </div>
  )
}
