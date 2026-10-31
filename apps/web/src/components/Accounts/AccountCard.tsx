"use client"
import { EllipsisVertical, FileX } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import type { ApiTypes } from "@balance/api-types"
import { Modal } from "../../lib/ComponentLibrary/Modal"
import { ConfirmDelete } from "./ConfirmDelete"
import { LinkedBank } from "./LinkedBank"
import { AnimatePresence } from "motion/react"

interface Props {
  account: ApiTypes.Account.TSerialized
}
export const AccountCard = ({ account }: Props) => {
  const [showMenu, setShowMenu] = useState(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)

  const menuRef = useRef<HTMLDivElement>(null)

  const handleClickMenu = (e: MouseEvent) => {
    e.stopPropagation()
    if (
      !showConfirmDelete &&
      menuRef.current &&
      !menuRef.current.contains(e.target as Node)
    ) {
      setShowMenu(false)
    }
  }

  useEffect(() => {
    document.addEventListener("click", handleClickMenu)
    return () => document.removeEventListener("click", handleClickMenu)
  }, [setShowMenu, menuRef, handleClickMenu])

  return (
    <div>
      <div className="border-4 border-grass-300 rounded-lg p-4 h-full min-h-32 relative">
        <div ref={menuRef} className="absolute right-1 top-1">
          <button
            type="button"
            aria-label="Account options"
            aria-expanded={showMenu}
            className="rounded-md p-1 text-grass-400 hover:bg-grass-200 hover:text-grass-700
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grass-600"
            onClick={() => setShowMenu(!showMenu)}
          >
            <EllipsisVertical />
          </button>
        </div>
        {showMenu && (
          <button
            type="button"
            onClick={() => setShowConfirmDelete(true)}
            className="absolute top-10 right-1 z-10 flex items-center gap-2 whitespace-nowrap rounded-lg
              border-2 border-grass-300 bg-white px-2 py-2 hover:bg-grass-300"
          >
            <FileX />
            Delete Account
          </button>
        )}
        {/* name first; the id is reference detail, so it's small and may wrap anywhere */}
        <div className="pr-8 space-y-1">
          <h2 className="text-lg font-semibold truncate">{account.name}</h2>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-grass-100 px-2 text-sm capitalize text-grass-800">
              {account.accountType}
            </span>
            {/* last four digits, known only for bank-linked accounts */}
            {account.bank?.mask && (
              <span
                className="font-mono text-sm tabular-nums text-slate-600"
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
