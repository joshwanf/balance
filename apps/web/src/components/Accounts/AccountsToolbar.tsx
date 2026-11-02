"use client"
import { useState } from "react"
import { AnimatePresence } from "motion/react"
import { PrimaryButton } from "../../lib/Base/Button"
import { CreateAccountForm } from "./CreateAccountForm"
import { LinkBankButton } from "./LinkBankButton"

interface Props {
  /** Plaid keys are set on the server, so "Link a bank" can work */
  canLinkBank: boolean
}

/**
 * Add-account and link-bank actions above the accounts grid. Like the budgets
 * toolbar it needs no data, so the page and its loading state render it
 * outside the grid's Suspense boundary and it never moves while the grid loads.
 */
export const AccountsToolbar = ({ canLinkBank }: Props) => {
  const [showAdd, setShowAdd] = useState(false)

  return (
    <div className="mb-4 flex flex-col space-y-2 rounded-2xl bg-brand-100 px-4 py-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <PrimaryButton
          onClick={() => setShowAdd(!showAdd)}
          aria-expanded={showAdd}
          className={`w-full sm:w-auto px-4 rounded-md border-2
            ${!showAdd ? "bg-brand-700" : "bg-brand-300"}
            ${!showAdd ? "text-brand-200" : "text-brand-800"}
            ${!showAdd ? "border-brand-700" : "border-brand-800"}
            `}
        >
          Add Account
        </PrimaryButton>
        {canLinkBank && <LinkBankButton />}
      </div>
      <AnimatePresence>
        {showAdd && (
          <div className="rounded-xl bg-surface sm:max-w-md">
            <CreateAccountForm closeForm={() => setShowAdd(false)} />
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
