import type { ApiTypes } from "@balance/api-types"
import { ApiError } from "../classes/ApiError"
import { pfetch, readJson, toApiError, toQuery } from "."

/**
 * List all transactions
 */
type ListOptions = ApiTypes.Transaction.ListSearchParams
interface List {
  (options: ListOptions): Promise<ApiTypes.Transaction.ListResponse | ApiError>
}
const list: List = async listOptions => {
  const url = `/api/transactions${toQuery({ ...listOptions })}`
  const res = await pfetch(url, "GET")
  if (!res.ok) {
    throw await toApiError(res)
  }
  return await readJson(res)
}

/**
 * Retrieve a transaction with the given ID
 */
type RetrieveResponse = ApiTypes.Transaction.RetrieveTransactionResponse
const retrieve = async (id: string): Promise<RetrieveResponse | ApiError> => {
  const res = await pfetch(
    `/api/transactions/${encodeURIComponent(id)}`,
    "GET",
  )
  if (!res.ok) {
    throw await toApiError(res)
  }
  return await readJson(res)
}

/**
 * Create a transaction
 */
type CreateRequest = ApiTypes.Transaction.CreateRequest
type CreateResponse = ApiTypes.Transaction.CreateResponse
interface Create {
  (input: CreateRequest): Promise<CreateResponse | ApiError>
}
const create: Create = async input => {
  const res = await pfetch("/api/transactions", "POST", input)
  if (!res.ok) {
    throw await toApiError(res)
  }
  return await readJson(res)
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
  const url = `/api/transactions/${encodeURIComponent(id)}`
  const res = await pfetch(url, "PATCH", { ...rest })
  if (!res.ok) {
    throw await toApiError(res)
  }
  return await readJson(res)
}

/**
 * Remove a transaction
 */
type RemoveResponse = ApiTypes.Transaction.RemoveTransactionResponse
interface Remove {
  (id: string): Promise<RemoveResponse | ApiError>
}
const remove: Remove = async id => {
  const res = await pfetch(
    `/api/transactions/${encodeURIComponent(id)}`,
    "DELETE",
  )
  if (!res.ok) {
    throw await toApiError(res)
  }
  return await readJson<RemoveResponse>(res, {
    type: "success",
    message: "Transaction removed",
  })
}

/**
 * Search transactions. Empty fields/arrays are dropped; arrays are sent
 * comma-separated (generalSearch → q, tags → tags).
 */
type SearchParams = Partial<ApiTypes.Transaction.SearchRequest>
type SearchResponse = ApiTypes.Transaction.SearchResponse
interface Search {
  (params: SearchParams): Promise<SearchResponse | ApiError>
}
const search: Search = async params => {
  const { generalSearch, startDate, endDate, tags } = params
  const url = `/api/transactions${toQuery({
    q: generalSearch,
    startDate,
    endDate,
    tags,
  })}`
  const res = await pfetch(url, "GET")
  if (!res.ok) {
    throw await toApiError(res)
  }
  return await readJson(res)
}

const transaction = { list, create, retrieve, change, remove, search }
export default transaction
