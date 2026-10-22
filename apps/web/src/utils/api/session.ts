import type { ApiTypes } from "@balance/api-types"
import { ApiError } from "../classes/ApiError"
import { pfetch, readJson, toApiError } from "."

type RestoreResponse = ApiTypes.Session.RestoreResponse
interface RestoreSession {
  (): Promise<RestoreResponse | ApiError>
}
const restore: RestoreSession = async () => {
  try {
    const res = await pfetch("/api/session", "GET")
    if (!res.ok) {
      throw await toApiError(res)
    }
    return await readJson<RestoreResponse>(res)
  } catch (e) {
    if (e instanceof ApiError) {
      return e
    }
    // network or parse failure: surface as an ApiError so callers can reject
    return new ApiError(
      { title: "Network error", status: 0, message: String(e) },
      0,
    )
  }
}

type LoginRequest = ApiTypes.Session.LoginRequest
type LoginResponse = ApiTypes.Session.LoginResponse
interface SubmitLogin {
  (input: LoginRequest): Promise<LoginResponse | ApiError>
}
const login: SubmitLogin = async loginDetails => {
  const response = await pfetch("/api/session", "POST", loginDetails)
  if (!response.ok) {
    return await toApiError(response)
  }
  return await readJson<LoginResponse>(response)
}

const loginDemoUser = async () => {
  return await login({ credential: "admin", password: "password" })
}

type LogoutResponseType = ApiTypes.Session.LogOutResponse
interface SubmitLogout {
  (): Promise<LogoutResponseType | ApiError>
}
const logout: SubmitLogout = async () => {
  const response = await pfetch("/api/session", "DELETE")
  if (!response.ok) {
    throw await toApiError(response)
  }
  return await readJson<LogoutResponseType>(response, {
    type: "success",
    success: "Logged out",
  })
}

type CreateRequestType = ApiTypes.Session.CreateRequest
type CreateResponseType = ApiTypes.Session.CreateResponse
interface SignUp {
  (input: CreateRequestType): Promise<CreateResponseType | ApiError>
}
const create: SignUp = async newUserDetails => {
  const response = await pfetch("/api/users", "POST", newUserDetails)
  if (!response.ok) {
    throw await toApiError(response)
  }
  return await readJson<CreateResponseType>(response)
}
const session = { restore, login, loginDemoUser, logout, create }
export default session
