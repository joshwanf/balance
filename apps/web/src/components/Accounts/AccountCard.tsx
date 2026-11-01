"use client"
import { EllipsisVertical, FileX } from "lucide-react"
import { useRef, useState } from "react"
import type { ApiTypes } from "@balance/api-types"
import { Modal } from "../../lib/ComponentLibrary/Modal"
import { Popover } from "../../lib/ComponentLibrary/Popover/Popover"
import { ConfirmDelete } from "./ConfirmDelete"
import { LinkedBank } from "./LinkedBank"
import { AnimatePresence } from "motion/react"

interface Props {
  account: ApiTypes.Account.TSerialized
}
export const AccountCard = ({ account }: Props) => {
  const [showMenu, setShowMenu] = useState(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)

  const menuButtonRef = useRef<HTMLButtonElement>(null)

  return (
    <div>
      <div className="border-4 border-brand-300 rounded-lg p-4 h-full min-h-28 relative">
        <div className="absolute right-1 top-1">
          <button
            ref={menuButtonRef}
            type="button"
            aria-label="Account options"
            aria-expanded={showMenu}
            className="rounded-md p-1 text-brand-400 hover:bg-brand-200 hover:text-brand-700
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
            onClick={() => setShowMenu(!showMenu)}
          >
            <EllipsisVertical />
          </button>
        </div>
        {/* the popover's overlay closes the menu on a click elsewhere or Escape */}
        {showMenu && (
          <Popover
            callerRef={menuButtonRef}
            selector="#authNode"
            closePopover={() => setShowMenu(false)}
            positionStyle="belowRightAligned"
          >
            <button
              type="button"
              onClick={() => {
                setShowMenu(false)
                setShowConfirmDelete(true)
              }}
              className="flex items-center gap-2 whitespace-nowrap rounded-lg border-2 border-brand-300
                bg-surface px-2 py-2 shadow-sm hover:bg-brand-300"
            >
              <FileX />
              Delete Account
            </button>
          </Popover>
        )}
        <div className="pr-8 space-y-1">
          <h2 className="text-lg font-semibold truncate">{account.name}</h2>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-brand-100 px-2 text-sm capitalize text-brand-800">
              {account.accountType}
            </span>
            {/* last four digits, known only for bank-linked accounts */}
            {account.bank?.mask && (
              <span
                className="font-mono text-sm tabular-nums text-neutral-600"
                aria-label={`Account ending ${account.bank.mask}`}
              >
                •••• {account.bank.mask}
              </span>
            )}
          </div>
        </div>
        {account.bank && <LinkedBank bank={account.bank} />}
      </div>
      <AnimatePresence>
        {showConfirmDelete && (
          <Modal
            selector="#authNode"
            closeModal={() => setShowConfirmDelete(false)}
            element={
              <ConfirmDelete
                accountId={account.id}
                closeModal={() => setShowConfirmDelete(false)}
              />
            }
          />
        )}
      </AnimatePresence>
    </div>
  )
}
