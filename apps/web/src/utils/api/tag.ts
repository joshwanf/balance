import type { ApiTypes } from "@balance/api-types"
import { ApiError } from "../classes/ApiError"
import { pfetch, readJson, toApiError, toQuery } from "."

/**
 * List all tags
 */
interface List {
  (): Promise<ApiTypes.Tag.ListResponse | ApiError>
}
const list: List = async () => {
  const res = await pfetch("/api/tags", "GET")
  if (!res.ok) {
    throw await toApiError(res)
  }
  return await readJson(res)
}

/**
 * Add tags to a transaction
 */
interface Add {
  (
    transactionId: string,
    tags: string[],
  ): Promise<ApiTypes.Tag.AddResponse | ApiError>
}
const add: Add = async (transactionId, tags) => {
  const url = `/api/transactions/${encodeURIComponent(transactionId)}/tags`
  const res = await pfetch(url, "POST", { tags })
  if (!res.ok) {
    throw await toApiError(res)
  }
  return await readJson(res)
}

/**
 * Remove tags from a transaction
 */
interface Remove {
  (
    transactionId: string,
    tags: string[],
  ): Promise<ApiTypes.Tag.RemoveResponse | ApiError>
}
const remove: Remove = async (transactionId, tags) => {
  const url = `/api/transactions/${encodeURIComponent(transactionId)}/tags${toQuery({ names: tags })}`
  const res = await pfetch(url, "DELETE")
  if (!res.ok) {
    throw await toApiError(res)
  }
  return await readJson<ApiTypes.Tag.RemoveResponse>(res, { tags: [] })
}

const tag = { list, add, remove }
export default tag
