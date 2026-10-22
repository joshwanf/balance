/** Balance api object to interact with the back end */
import session from "./session"
import transaction from "./transaction"
import category from "./category"
import account from "./account"
import trend from "./trend"
import tag from "./tag"
import { ApiError } from "../classes/ApiError"

export type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE"

type QueryValue = string | number | boolean | string[] | null | undefined
export type QueryParams = Record<string, QueryValue>

export const opts = {
  headers: {
    "Content-Type": "application/json",
  },
}

/**
 * Build a query string from params. Empty values (undefined, null, "", [])
 * are dropped; arrays are joined with commas.
 */
export const toQuery = (params?: QueryParams) => {
  if (!params) return ""
  const entries: [string, string][] = []
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue
    if (Array.isArray(v)) {
      if (v.length === 0) continue
      entries.push([k, v.join(",")])
    } else {
      entries.push([k, String(v)])
    }
  }
  const qs = new URLSearchParams(entries).toString()
  return qs ? `?${qs}` : ""
}

/**
 * Fetch helper. GET and DELETE never send a body; pass params in the URL.
 */
export const pfetch = async (
  url: string,
  method: HttpMethod = "GET",
  body?: Record<string, any>,
) => {
  const hasBody = method !== "GET" && method !== "DELETE"
  const options: RequestInit = {
    method,
    credentials: "same-origin",
    ...(hasBody
      ? { ...opts, body: JSON.stringify({ ...body }) }
      : {}),
  }
  return await fetch(url, options)
}

/** Parse a response body, returning `fallback` for 204 / empty bodies */
export const readJson = async <T>(res: Response, fallback?: T): Promise<T> => {
  if (res.status === 204) return fallback as T
  const text = await res.text()
  if (!text) return fallback as T
  return JSON.parse(text) as T
}

/** Build an ApiError from a non-ok response (error shape { title, message, errors? }) */
export const toApiError = async (res: Response) => {
  let err: any
  try {
    err = await readJson(res, { title: res.statusText, message: res.statusText })
  } catch {
    err = { title: res.statusText, message: res.statusText }
  }
  return new ApiError({ status: res.status, ...err }, res.status)
}

export const balance = { session, transaction, category, account, trend, tag }

export default balance
