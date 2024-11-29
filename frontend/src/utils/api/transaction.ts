import { ApiTypes } from "../../types/api"
import { ApiError } from "../classes/ApiError"
import { opts, pfetch } from "."
import moment from "moment"

/**
 * List all transactions
 */
type ListOptions = ApiTypes.Transaction.ListSearchParams
interface List {
  (options: ListOptions): Promise<ApiTypes.Transaction.ListResponse | ApiError>
}
const list: List = async listOptions => {
  const params = Object.entries(listOptions).filter(([k, v]) => v)
  const searchParams = new URLSearchParams(params).toString()
  const url = `/api/transaction/list${`?` + searchParams}`
  const res = await pfetch(url)
  if (!res.ok) {
    throw new ApiError(await res.json(), res.status)
  }
  return await res.json()
}

/**
 * Retrieve a transaction with the given ID
 */
interface Retrieve {
  (
    id: string,
  ): Promise<ApiTypes.Transaction.RetrieveTransactionResponse | ApiError>
}
const retrieve = (id: string) => {}

/**
 * Create a transaction
 */
type CreateRequest = ApiTypes.Transaction.CreateRequest
type CreateResponse = ApiTypes.Transaction.CreateResponse
interface Create {
  (input: CreateRequest): Promise<CreateResponse | ApiError>
}
const create: Create = async input => {
  const url = "/api/transaction/create"
  const res = await pfetch(url, input)
  if (!res.ok) {
    throw new ApiError(await res.json(), res.status)
  }
  return await res.json()
}

/**
 * Edit a transaction
 */
type ChangeRequest = {
  id: string
} & Partial<ApiTypes.Transaction.ChangeRequest>
type ChangeResponse = ApiTypes.Transaction.ChangeResponse
interface Change {
  (updatedFields: ChangeRequest): Promise<ChangeResponse | ApiError>
}
const change: Change = async input => {
  const { id, ...rest } = input
  const url = `/api/transaction/change/${id}`
  const body = { ...rest }
  const res = await pfetch(url, body)
  if (!res.ok) {
    throw new ApiError(await res.json(), res.status)
  }
  return await res.json()
}

/**
 * Remove a transaction
 */
interface Remove {
  (
    id: string,
  ): Promise<ApiTypes.Transaction.RemoveTransactionResponse | ApiError>
}
const remove: Remove = async id => {
  const url = `/api/transaction/remove/${id}`
  const res = await pfetch(url)
  console.log(res)
  if (!res.ok) {
    throw new ApiError(await res.json(), res.status)
  }
  return await res.json()
}
const transaction = { list, create, retrieve, change, remove }
export default transaction
