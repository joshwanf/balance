import type { ApiTypes } from "../../types/api"
import { ApiError } from "../classes/ApiError"
import { pfetch } from "."

/**
 * List all tags
 */
interface List {
  (): Promise<ApiTypes.Tag.ListResponse | ApiError>
}
const list: List = async () => {
  const url = `/api/tag/list`
  const res = await pfetch(url)
  if (!res.ok) {
    throw new ApiError(await res.json(), res.status)
  }
  return await res.json()
}

/**
 * Add tag
 */
interface Add {
  (
    transactionId: string,
    tags: string[],
  ): Promise<ApiTypes.Tag.AddResponse | ApiError>
}
const add: Add = async (transactionId, tags) => {
  const url = `/api/tag/add/${transactionId}`
  const res = await pfetch(url, { tags })
  if (!res.ok) {
    throw new ApiError(await res.json(), res.status)
  }
  return await res.json()
}

/**
 * Remove tag
 */
interface Remove {
  (
    transactionId: string,
    tags: string[],
  ): Promise<ApiTypes.Tag.AddResponse | ApiError>
}
const remove: Add = async (transactionId, tags) => {
  const url = `/api/tag/remove/${transactionId}`
  const res = await pfetch(url, { tags })
  if (!res.ok) {
    throw new ApiError(await res.json(), res.status)
  }
  return await res.json()
}

const transaction = { list, add, remove }
export default transaction
