/** Balance api object to interact with the back end */
import type { ApiTypes } from "../../types/api"
// import type {
//   LogInSuccess,
//   LogInInvalidCredential,
// } from "../../../../utils/types/api/session"

import session from "./session"
import transaction from "./transaction"
import category from "./category"

export const opts = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
}

export const pfetch = async (url: string, body?: Record<string, any>) => {
  const options = {
    ...opts,
    body: JSON.stringify({ ...body }),
  }
  return await fetch(url, options)
}

export const balance = { session, transaction, category }

export default balance
