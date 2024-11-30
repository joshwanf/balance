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
 * Create a category
 */
interface CreateOptions {
  name: string
  amount: number
  month: string
}
interface Create {
  (input: CreateOptions): Promise<ApiTypes.Category.CreateResponse | ApiError>
}
const create: Create = async createOptions => {
  const { month, ...createInput } = createOptions
  const queryParams = new URLSearchParams({ startMonth: month }).toString()
  const url = `/api/category/create${`?` + queryParams}`
  const res = await pfetch(url, createInput)
  if (!res.ok) {
    return new ApiError(await res.json(), res.status)
  }
  return await res.json()
}

/**
 * Edit a category
 */
type ChangeRequest = {
  id: string
  month: string
} & Partial<ApiTypes.Category.ChangeRequest>
type ChangeResponse = ApiTypes.Category.ChangeResponse
interface Change {
  (updatedFields: ChangeRequest): Promise<ChangeResponse | ApiError>
}
const change: Change = async input => {
  const { id, month, ...rest } = input
  const queryParams = new URLSearchParams({ startMonth: month }).toString()
  const url = `/api/category/change/${id}${`?` + queryParams}`
  const body = { ...rest }
  const res = await pfetch(url, body)
  if (!res.ok) {
    throw new ApiError(await res.json(), res.status)
  }
  return await res.json()
}

/**
 * Remove a category
 */
type RemoveRequest = ApiTypes.Category.RemoveRequest
type RemoveResponse = ApiTypes.Category.RemoveResponse
interface Remove {
  (removeInput: RemoveRequest): Promise<RemoveResponse | ApiError>
}
const remove: Remove = async removeInput => {
  const url = `/api/category/remove`
  const res = await pfetch(url, removeInput)
  if (!res.ok) {
    throw new ApiError(await res.json(), res.status)
  }
  return await res.json()
}
const category = { list, create, retrieve, change, remove }
export default category
