"use client"
import { useEffect, useRef } from "react"
import { Provider } from "react-redux"
import type { ApiTypes } from "@balance/api-types"
import { makeStore, type AppStore } from "../store/store"
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
      store.dispatch(addManyPartialCategories(categories))
      store.dispatch(addPartialAccounts(accounts))
    }
    storeRef.current = store
  }

  useEffect(() => {
    if (user && storeRef.current) {
      const { accounts, categories, ...safeUser } = user
      storeRef.current.dispatch(addManyPartialCategories(categories))
      storeRef.current.dispatch(addPartialAccounts(accounts))
    }
  }, [user?.id])

  return (
    <Provider key={user?.id ?? "guest"} store={storeRef.current}>
      {children}
    </Provider>
  )
}

export default Providers
