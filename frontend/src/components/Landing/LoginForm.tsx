import { useState } from "react"
import { useAppDispatch } from "../../app/hooks"
import { useNavigate } from "react-router"
import { login } from "../../features/sessionSlice"
import balance from "../../utils/api"
import * as Ipt from "../../lib/Base/Input"
import * as Btn from "../../lib/Base/Button"
import { Errors } from "../../lib/ComponentLibrary/Errors"
import { loginDemoThunk, loginThunk } from "../../utils/thunks/session"
import { ApiError } from "../../utils/classes/ApiError"
import { listCategoriesThunk } from "../../utils/thunks/category"

interface Props {
  closeModal?: () => void
}
export const LoginForm: React.FC<Props> = ({ closeModal }) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [form, setForm] = useState({ credential: "", password: "" })
  const [errors, setErrors] = useState<string | null>(null)
  const handleChangeForm = (field: string) => (input: string) => {
    setForm({ ...form, [field]: input })
  }
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors(null)
    const isValidForm = form.credential.length >= 4 && form.password.length >= 6
    if (isValidForm) {
      const res = await dispatch(loginThunk(form)).unwrap()
      // const categories = await dispatch(listCategoriesThunk()).unwrap()
      if (closeModal) {
        closeModal()
        navigate("/my-balance")
      }
    }
  }
  const handleLoginDemo = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setErrors(null)
    const res = await dispatch(loginDemoThunk()).unwrap()
    // const categories = await dispatch(listCategoriesThunk()).unwrap()
    if (closeModal) {
      closeModal()
      navigate("/my-balance")
    }
  }

  return (
    <div>
      <div className="bg-white border-0 border-slate-300 rounded-md p-4 m-6 space-y-2">
        {errors && <Errors errors={errors} />}
        <form className="space-y-2" onSubmit={handleLogin}>
          <p>Email/username</p>
          <Ipt.TextInput
            text={form.credential}
            onChange={handleChangeForm("credential")}
          />
          <p>Password</p>
          <Ipt.TextInput
            text={form.password}
            onChange={handleChangeForm("password")}
          />
          <Btn.PrimaryButton>Log In</Btn.PrimaryButton>
        </form>
        <Btn.TertiaryButton onClick={handleLoginDemo}>
          Log in as demo user
        </Btn.TertiaryButton>
      </div>
    </div>
  )
}
