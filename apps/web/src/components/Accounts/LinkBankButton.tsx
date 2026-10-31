"use client"
import { Landmark } from "lucide-react"
import { useEffect, useState, useTransition } from "react"
import { usePlaidLink } from "react-plaid-link"
import {
  createLinkTokenAction,
  exchangePublicTokenAction,
} from "@/server/actions/plaid"
import { LoadingSpinner } from "@/components/Skeletons/LoadingSpinner"

/** Opens Plaid Link; the outcome shows as a line of text under the toolbar. */
export const LinkBankButton = () => {
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
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className="flex w-full items-center justify-center gap-2 rounded-md border-2 border-grass-700
          bg-white px-4 py-0.5 text-grass-800 hover:bg-grass-200 disabled:opacity-60 sm:w-auto"
      >
        {/* same-size slot, so the spinner doesn't resize the button */}
        <span className="flex size-5 items-center justify-center">
          {isPending ? <LoadingSpinner /> : <Landmark className="size-5" />}
        </span>
        Link a bank
      </button>
      {message && (
        <p role="status" className="text-sm text-slate-600 sm:basis-full">
          {message}
        </p>
      )}
    </>
  )
}
