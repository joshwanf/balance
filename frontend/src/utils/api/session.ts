import { ApiTypes } from "../../types/api"
import { assertNever } from "../absurd"
import { ApiError } from "../classes/ApiError"
import { opts, pfetch } from "."

type RestoreResponse = ApiTypes.Session.RestoreResponse
interface RestoreSession {
  (): Promise<RestoreResponse | ApiError>
}
const restore: RestoreSession = async () => {
  try {
    const url = "/api/session/verify"
    const res = await fetch(url, { ...opts })
    if (!res.ok) {
      const error = new ApiError(await res.json(), res.status)
      throw error
    }
    // const data = (await res.json()) as RestoreSessionType
    // console.log(data)
    return await res.json()
  } catch (e) {
    if (e instanceof ApiError) {
      // console.log(e)
      return e
    }
  }
}

type LoginRequest = ApiTypes.Session.LoginRequest
type LoginResponse = ApiTypes.Session.LoginResponse
type LogInInvalidCredentialType = ApiTypes.Session.LogInInvalidCredential
type LogInUnknownErrorType = ApiTypes.Session.LogInUnknownError
interface SubmitLogin {
  (input: LoginRequest): Promise<LoginResponse | ApiError>
}
const login: SubmitLogin = async loginDetails => {
  const url = "/api/session/login"
  const response = await pfetch(url, loginDetails)
  if (!response.ok) {
    throw new ApiError(await response.json(), response.status)
  }
  const data = await response.json()
  return data
}

const loginDemoUser = async () => {
  return await login({ credential: "admin", password: "password" })
}

type LogoutResponseType = ApiTypes.Session.LogOutSuccessResponse
type LogOutErrorResponseType = ApiTypes.Session.LogOutErrorResponse
interface SubmitLogout {
  (): Promise<LogoutResponseType | LogOutErrorResponseType>
}
const logout: SubmitLogout = async () => {
  const url = "/api/session/logout"
  const options = { ...opts, body: JSON.stringify({}) }
  try {
    const response = await fetch(url, options)
    if (!response.ok) {
      throw response
    }
    const data = (await response.json()) as LogoutResponseType
    // console.log({ token: data.success.token })
    return data
  } catch (e: any) {
    return { type: "error", error: "Logout error" }
  }
}

type SignUpResponseType = ApiTypes.User.CreateUserResponse
interface SignUp {
  (input: {
    firstName: string
    lastName: string
    email: string
    username: string
    password: string
  }): Promise<SignUpResponseType | ApiError>
}
const signup: SignUp = async newUserDetails => {
  const url = "/api/session/signup"
  const { password, ...rest } = newUserDetails
  const hashedPassword = password
  const options = { ...opts, body: JSON.stringify({ ...rest, hashedPassword }) }
  const response = await fetch(url, { ...options })
  if (!response.ok) {
    throw new ApiError(await response.json(), response.status)
  }

  return await response.json()
}
const session = { restore, login, loginDemoUser, logout, signup }
export default session
