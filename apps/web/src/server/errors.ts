/** Shape of every error body the API returns: { title, message, errors? } */
export interface ApiErrorBody {
  title: string
  message: unknown
  errors?: unknown
  status: number
}

export const apiError = (
  status: number,
  title: string,
  message: unknown,
  errors?: unknown
): ApiErrorBody => ({ title, message, status, ...(errors ? { errors } : {}) })

export const isApiErrorBody = (e: unknown): e is ApiErrorBody =>
  typeof e === "object" &&
  e !== null &&
  "status" in e &&
  typeof (e as { status: unknown }).status === "number" &&
  "title" in e
