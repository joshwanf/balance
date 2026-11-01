"use client"
import moment from "moment"
import { Landmark, RefreshCw } from "lucide-react"
import { useEffect, useState, useTransition } from "react"
import { usePlaidLink } from "react-plaid-link"
import type { ApiTypes } from "@balance/api-types"
import {
  createReconnectTokenAction,
  finishReconnectAction,
  syncNowAction,
} from "@/server/actions/plaid"

type Bank = ApiTypes.Account.LinkedBank

// Banks re-sync every 12 hours, so a day without one means something's off
const STALE_AFTER_HOURS = 24

type Health = "ok" | "stale" | "attention" | "off"

const DOT: Record<Health, string> = {
  ok: "bg-success-500",
  stale: "bg-warning-500",
  attention: "bg-danger-500",
  off: "bg-neutral-400",
}

/** How the connection is doing, from Plaid's status and the last sync */
export const bankHealth = (
  bank: Pick<Bank, "status" | "lastSyncedAt">,
  now = moment(),
): { health: Health; label: string } => {
  const synced = bank.lastSyncedAt ? moment(bank.lastSyncedAt) : null
  const ago = synced ? synced.from(now) : null
  switch (bank.status) {
    case "login_required":
      return { health: "attention", label: "Needs you to sign in again" }
    case "error":
      return {
        health: "attention",
        label: ago ? `Sync failed · last synced ${ago}` : "Sync failed",
      }
    case "revoked":
      return { health: "off", label: "Disconnected" }
    case "active":
      if (!synced) return { health: "stale", label: "Waiting for first sync" }
      return now.diff(synced, "hours") >= STALE_AFTER_HOURS
        ? { health: "stale", label: `Last synced ${ago}` }
        : { health: "ok", label: `Synced ${ago}` }
  }
}

interface Props {
  bank: Bank
}

export const LinkedBank = ({ bank }: Props) => {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<string | null>(null)
  const [linkToken, setLinkToken] = useState<string | null>(null)
  const { health, label } = bankHealth(bank)

  const handleSync = () => {
    setMessage(null)
    startTransition(async () => {
      const result = await syncNowAction(bank.itemId)
      setMessage(
        result.status === "error"
          ? result.error
          : result.added + result.modified + result.removed === 0
            ? "Up to date. New transactions can take a minute to arrive."
            : `${result.added} new, ${result.modified} updated, ${result.removed} removed`,
      )
    })
  }

  const handleReconnect = () => {
    if (isPending || linkToken) return
    setMessage(null)
    startTransition(async () => {
      const result = await createReconnectTokenAction(bank.itemId)
      if (result.status === "error") setMessage(result.error)
      else setLinkToken(result.linkToken)
    })
  }

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: () => {
      setLinkToken(null)
      startTransition(async () => {
        const result = await finishReconnectAction(bank.itemId)
        setMessage(
          result.status === "error"
            ? result.error
            : "Reconnected. New transactions will appear in a minute or two.",
        )
      })
    },
    onExit: () => setLinkToken(null),
  })
  useEffect(() => {
    if (linkToken && ready) open()
  }, [linkToken, ready, open])

  const actionClass =
    "ml-auto flex shrink-0 items-center gap-1 rounded-md px-2 py-0.5 font-semibold text-brand-800 hover:bg-brand-100 disabled:opacity-50"

  return (
    <div className="mt-3 space-y-1 border-t-2 border-brand-200 pt-3 text-sm">
      <div className="flex items-center gap-2">
        <Landmark className="size-4 shrink-0 text-brand-700" />
        <span className="truncate font-semibold">
          {bank.institutionName ?? "Linked bank"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className={`size-2 shrink-0 rounded-full ${DOT[health]}`}
        />
        <span
          className={`truncate ${health === "attention" ? "text-ink" : "text-neutral-500"}`}
        >
          {label}
        </span>
        {bank.status === "login_required" ? (
          <button
            type="button"
            onClick={handleReconnect}
            disabled={isPending}
            className={actionClass}
          >
            Reconnect
          </button>
        ) : bank.status !== "revoked" ? (
          <button
            type="button"
            onClick={handleSync}
            disabled={isPending}
            className={actionClass}
          >
            <RefreshCw
              className={`size-4 ${isPending ? "animate-spin" : ""}`}
            />
            Sync now
          </button>
        ) : null}
      </div>
      {message && (
        <div role="status" className="text-neutral-600">
          {message}
        </div>
      )}
    </div>
  )
}
