import type { ApiTypes } from "@balance/api-types"
import { ApiError } from "../classes/ApiError"
import { pfetch, readJson, toApiError, toQuery } from "."

/**
 * List all accounts
 */
type ListOptions = ApiTypes.Account.ListSearchParams
interface List {
  (options: ListOptions): Promise<ApiTypes.Account.ListResponse | ApiError>
}
const list: List = async listOptions => {
  const url = `/api/accounts${toQuery({ ...listOptions })}`
  const res = await pfetch(url, "GET")
  if (!res.ok) {
    throw await toApiError(res)
  }
  return await readJson(res)
}

/**
 * Retrieve an account with the given ID (not implemented in the original app)
 */
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
  const res = await pfetch("/api/accounts", "POST", input)
  if (!res.ok) {
    throw await toApiError(res)
  }
  return await readJson(res)
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
  const url = `/api/accounts/${encodeURIComponent(id)}`
  const res = await pfetch(url, "PATCH", { ...rest })
  if (!res.ok) {
    throw await toApiError(res)
  }
  return await readJson(res)
}

/**
 * Remove accounts (one DELETE request per id)
 */
type RemoveResponse = ApiTypes.Account.RemoveResponse
interface Remove {
  (accountIds: string[]): Promise<RemoveResponse | ApiError>
}
const remove: Remove = async accountIds => {
  let count = 0
  for (const id of accountIds) {
    const res = await pfetch(
      `/api/accounts/${encodeURIComponent(id)}`,
      "DELETE",
    )
    if (!res.ok) {
      throw await toApiError(res)
    }
    count++
  }
  return { type: "success", success: { count } }
}
const account = { list, create, retrieve, change, remove }
export default account
