"use client"
import { useEffect, useRef } from "react"
import { Provider } from "react-redux"
import { makeStore, type AppStore } from "../store/store"
import { restoreSession } from "../utils/thunks/session"

interface Props {
  children: React.ReactNode
}

export const Providers: React.FC<Props> = ({ children }) => {
  const storeRef = useRef<AppStore | null>(null)
  if (!storeRef.current) {
    storeRef.current = makeStore()
  }

  useEffect(() => {
    storeRef.current?.dispatch(restoreSession())
  }, [])

  return <Provider store={storeRef.current}>{children}</Provider>
}

export default Providers
