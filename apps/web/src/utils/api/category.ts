import type { ApiTypes } from "@balance/api-types"
import { ApiError } from "../classes/ApiError"
import { pfetch, readJson, toApiError, toQuery } from "."

/**
 * List all categories
 */
type ListOptions = ApiTypes.Category.ListSearchParams
interface List {
  (listOptions: ListOptions): Promise<ApiTypes.Category.ListResponse | ApiError>
}
const list: List = async listOptions => {
  const url = `/api/categories${toQuery({ ...listOptions })}`
  const res = await pfetch(url, "GET")
  if (!res.ok) {
    throw await toApiError(res)
  }
  return await readJson(res)
}

/**
 * Retrieve a budget with the given ID
 */
const retrieve = async (
  id: string,
  startMonth?: string,
): Promise<ApiTypes.Category.RetrieveResponse | ApiError> => {
  const url = `/api/categories/${encodeURIComponent(id)}${toQuery({ startMonth })}`
  const res = await pfetch(url, "GET")
  if (!res.ok) {
    throw await toApiError(res)
  }
  return await readJson(res)
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
  const url = `/api/categories${toQuery({ startMonth: month })}`
  const res = await pfetch(url, "POST", createInput)
  if (!res.ok) {
    return await toApiError(res)
  }
  return await readJson(res)
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
  const url = `/api/categories/${encodeURIComponent(id)}${toQuery({ startMonth: month })}`
  const res = await pfetch(url, "PATCH", { ...rest })
  if (!res.ok) {
    throw await toApiError(res)
  }
  return await readJson(res)
}

/**
 * Remove categories: DELETE /api/categories/:id for one,
 * DELETE /api/categories?ids=a,b for several
 */
type RemoveRequest = ApiTypes.Category.RemoveRequest
type RemoveResponse = ApiTypes.Category.RemoveResponse
interface Remove {
  (removeInput: RemoveRequest): Promise<RemoveResponse | ApiError>
}
const remove: Remove = async removeInput => {
  const { categoryIds } = removeInput
  if (categoryIds.length === 0) {
    return { type: "success", success: { count: 0 } }
  }
  const url =
    categoryIds.length === 1
      ? `/api/categories/${encodeURIComponent(categoryIds[0])}`
      : `/api/categories${toQuery({ ids: categoryIds })}`
  const res = await pfetch(url, "DELETE")
  if (!res.ok) {
    throw await toApiError(res)
  }
  return await readJson<RemoveResponse>(res, {
    type: "success",
    success: { count: categoryIds.length },
  })
}
const category = { list, create, retrieve, change, remove }
export default category
