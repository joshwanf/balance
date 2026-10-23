"use client"
import { useRef } from "react"
import { Provider } from "react-redux"
import type { ApiTypes } from "@balance/api-types"
import { makeStore, type AppStore } from "../store/store"
import { login } from "../features/sessionSlice"
import { addManyPartialCategories } from "../features/categoriesSlice"
import { addPartialAccounts } from "../features/accountsSlice"

type SessionUser = ApiTypes.Session.LoginResponse["success"]["user"]

interface Props {
  /** The logged-in user, read from the cookie by the root layout */
  user: SessionUser | null
  children: React.ReactNode
}

export const Providers = ({ user, children }: Props) => {
  const storeRef = useRef<AppStore | null>(null)
  if (!storeRef.current) {
    const store = makeStore()
    if (user) {
      const { accounts, categories, ...safeUser } = user
      store.dispatch(login(safeUser))
      store.dispatch(addManyPartialCategories(categories))
      store.dispatch(addPartialAccounts(accounts))
    }
    storeRef.current = store
  }

  return <Provider store={storeRef.current}>{children}</Provider>
}

export default Providers
