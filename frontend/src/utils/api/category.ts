import { ApiTypes } from "../../types/api"
import { ApiError } from "../classes/ApiError"
import { opts, pfetch } from "."

/**
 * List all categories
 */
interface List {
  (): Promise<ApiTypes.Category.ListResponse | ApiError>
}
const list: List = async () => {
  const url = "/api/category/list"
  const res = await pfetch(url)
  if (!res.ok) {
    throw new ApiError(await res.json(), res.status)
  }
  return await res.json()
}

/**
 * Retrieve a budget with the given ID
 */
interface Retrieve {
  (id: string): Promise<ApiTypes.Category.RetrieveResponse | ApiError>
}
const retrieve = async (id: string) => {
  const url = `/api/category/retrieve/${id}`
  const res = await pfetch(url)
  if (!res.ok) {
    throw new ApiError(await res.json(), res.status)
  }
  return await res.json()
}

/**
 * Create a transaction
 */
interface Create {
  (
    input: ApiTypes.Transaction.ChangeTransactionRequest,
  ): Promise<ApiTypes.Transaction.CreateTransactionResponse | ApiError>
}
// const create: Create = async () => {}

/**
 * Edit a transaction
 */
interface Change {
  ({
    id,
    field,
    newValue,
  }: {
    id: string
    field: string
    newValue: string
  }): Promise<ApiTypes.Transaction.Transaction | ApiError>
}
const change: Change = async ({ id, field, newValue }) => {
  const url = `/api/transaction/change/${id}`
  const body = { [field]: newValue }
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
const category = { list, retrieve, change, remove }
export default category
