"use client"
import { Landmark } from "lucide-react"
import { useEffect, useState, useTransition } from "react"
import { usePlaidLink } from "react-plaid-link"
import {
  createLinkTokenAction,
  exchangePublicTokenAction,
} from "@/server/actions/plaid"
import { LoadingSpinner } from "@/components/Skeletons/LoadingSpinner"

export const LinkBankCard = () => {
  const [token, setToken] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    if (isPending || token) return
    setMessage(null)
    startTransition(async () => {
      const result = await createLinkTokenAction()
      if (result.status === "error") setMessage(result.error)
      else setToken(result.linkToken)
    })
  }

  const handleSuccess = (publicToken: string | null) => {
    if (!publicToken) return
    setToken(null)
    startTransition(async () => {
      const result = await exchangePublicTokenAction(publicToken)
      setMessage(
        result.status === "error"
          ? result.error
          : result.accounts === 0
            ? `Linked ${result.institutionName ?? "your bank"}, but it has no checking, savings or credit card accounts to track.`
            : `Linked ${result.institutionName ?? "your bank"}. Transactions will appear in a minute or two.`,
      )
    })
  }

  const { open, ready } = usePlaidLink({
    token,
    onSuccess: handleSuccess,
    onExit: () => setToken(null),
  })
  useEffect(() => {
    if (token && ready) open()
  }, [token, ready, open])

  return (
    <div
      onClick={handleClick}
      className="border-4 border-dashed border-grass-300 rounded-lg
        w-full h-full min-h-32 p-4 flex flex-col items-center justify-center gap-1
        text-center text-grass-400 hover:cursor-pointer hover:text-grass-700"
    >
      {isPending ? <LoadingSpinner /> : <Landmark />}
      <div>Link a bank</div>
      {message && <div className="text-sm text-slate-600">{message}</div>}
    </div>
  )
}
