import type { ApiTypes } from "../../types/api"
import { ApiError } from "../classes/ApiError"
import { pfetch } from "."

/**
 * List all accounts
 */
type ListOptions = ApiTypes.Account.ListSearchParams
interface List {
  (options: ListOptions): Promise<ApiTypes.Account.ListResponse | ApiError>
}
const list: List = async listOptions => {
  const params = Object.entries(listOptions).filter(([k, v]) => v)
  const searchParams = new URLSearchParams(params).toString()
  const url = `/api/account/list${`?` + searchParams}`
  const res = await pfetch(url)
  if (!res.ok) {
    throw new ApiError(await res.json(), res.status)
  }
  return await res.json()
}

/**
 * Retrieve an account with the given ID
 */
interface Retrieve {
  (
    id: string,
  ): Promise<ApiTypes.Transaction.RetrieveTransactionResponse | ApiError>
}
const retrieve = (id: string) => {}

/**
 * Create an account
 */
type CreateRequest = ApiTypes.Account.CreateRequest
type CreateResponse = ApiTypes.Account.CreateResponse
interface Create {
  (input: CreateRequest): Promise<CreateResponse | ApiError>
}
const create: Create = async input => {
  const url = "/api/account/create"
  const res = await pfetch(url, input)
  if (!res.ok) {
    throw new ApiError(await res.json(), res.status)
  }
  return await res.json()
}

/**
 * Edit an account
 */
type ChangeRequest = {
  id: string
} & Partial<ApiTypes.Account.ChangeRequest>
type ChangeResponse = ApiTypes.Account.ChangeResponse
interface Change {
  (updatedFields: ChangeRequest): Promise<ChangeResponse | ApiError>
}
const change: Change = async input => {
  const { id, ...rest } = input
  const url = `/api/account/change/${id}`
  const body = { ...rest }
  const res = await pfetch(url, body)
  if (!res.ok) {
    throw new ApiError(await res.json(), res.status)
  }
  return await res.json()
}

/**
 * Remove an account
 */
interface Remove {
  (accountIds: string[]): Promise<ApiTypes.Account.RemoveResponse | ApiError>
}
const remove: Remove = async accountIds => {
  const url = `/api/account/remove`
  const res = await pfetch(url, { accountIds })
  if (!res.ok) {
    throw new ApiError(await res.json(), res.status)
  }
  return await res.json()
}
const transaction = { list, create, retrieve, change, remove }
export default transaction
