"use client"
import moment from "moment"
import { Landmark, RefreshCw } from "lucide-react"
import { useState, useTransition } from "react"
import type { ApiTypes } from "@balance/api-types"
import { syncNowAction } from "@/server/actions/plaid"

const STATUS_LABELS: Record<ApiTypes.Account.LinkedBank["status"], string> = {
  active: "Connected",
  login_required: "Needs sign-in",
  error: "Error",
  revoked: "Disconnected",
}

interface Props {
  bank: ApiTypes.Account.LinkedBank
}

export const LinkedBank = ({ bank }: Props) => {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<string | null>(null)
  const isActive = bank.status === "active"

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

  return (
    <div className="mt-3 pt-3 border-t-2 border-grass-200 space-y-1 text-sm">
      <div className="flex items-center gap-2">
        <Landmark className="size-4 shrink-0 text-grass-700" />
        <span className="truncate font-semibold">
          {bank.institutionName ?? "Linked bank"}
        </span>
        <span
          className={`ml-auto shrink-0 rounded-full px-2 text-xs ${
            isActive
              ? "bg-grass-100 text-grass-800"
              : "bg-amber-100 text-amber-800"
          }`}
        >
          {STATUS_LABELS[bank.status]}
        </span>
      </div>
      <div className="flex items-center gap-2 text-slate-500">
        <span className="truncate">
          {bank.mask && `•••• ${bank.mask} · `}
          {bank.lastSyncedAt
            ? `synced ${moment(bank.lastSyncedAt).fromNow()}`
            : "not synced yet"}
        </span>
        {isActive && (
          <button
            type="button"
            onClick={handleSync}
            disabled={isPending}
            className="ml-auto flex shrink-0 items-center gap-1 rounded-md px-2 py-0.5
            text-grass-800 hover:bg-grass-200 disabled:opacity-50"
          >
            <RefreshCw
              className={`size-4 ${isPending ? "animate-spin" : ""}`}
            />
            Sync now
          </button>
        )}
      </div>
      {message && <div className="text-slate-600">{message}</div>}
    </div>
  )
}
