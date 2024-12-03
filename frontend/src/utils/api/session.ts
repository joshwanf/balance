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
interface SubmitLogin {
  (input: LoginRequest): Promise<LoginResponse | ApiError>
}
const login: SubmitLogin = async loginDetails => {
  const url = "/api/session/login"
  const response = await pfetch(url, loginDetails)
  if (!response.ok) {
    const error = await response.json()
    return new ApiError(error, response.status)
  }
  const data = await response.json()
  return data
}

const loginDemoUser = async () => {
  return await login({ credential: "admin", password: "password" })
}

type LogoutResponseType = ApiTypes.Session.LogOutResponse
interface SubmitLogout {
  (): Promise<LogoutResponseType | ApiError>
}
const logout: SubmitLogout = async () => {
  const url = "/api/session/logout"
  const options = { ...opts, body: JSON.stringify({}) }
  const response = await fetch(url, options)
  if (!response.ok) {
    throw new ApiError(await response.json(), response.status)
  }
  const data = (await response.json()) as LogoutResponseType

  return data
}

type CreateRequestType = ApiTypes.Session.CreateRequest
type CreateResponseType = ApiTypes.Session.CreateResponse
interface SignUp {
  (input: CreateRequestType): Promise<CreateResponseType | ApiError>
}
const create: SignUp = async newUserDetails => {
  const url = "/api/session/create"
  const response = await pfetch(url, newUserDetails)
  if (!response.ok) {
    throw new ApiError(await response.json(), response.status)
  }

  return await response.json()
}
const session = { restore, login, loginDemoUser, logout, create }
export default session
