/** Balance api object to interact with the back end */
import session from "./session"
import transaction from "./transaction"
import category from "./category"
import account from "./account"
import trend from "./trend"
import tag from "./tag"

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

export const balance = { session, transaction, category, account, trend, tag }

export default balance
