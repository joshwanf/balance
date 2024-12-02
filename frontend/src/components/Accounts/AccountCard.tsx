import { EllipsisVertical, FileX } from "lucide-react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { selectAccountById } from "../../features/accountsSlice"
import { useEffect, useRef, useState } from "react"
import { Modal } from "../../lib/ComponentLibrary/Modal"
import { ConfirmDelete } from "./ConfirmDelete"
import { AnimatePresence } from "motion/react"
import balance from "../../utils/api"
import { ApiError } from "../../utils/classes/ApiError"
import { removeAccountThunk } from "../../utils/thunks/account"

interface Props {
  accountId: string
}
export const AccountCard: React.FC<Props> = props => {
  const { accountId, ...rest } = props
  const dispatch = useAppDispatch()
  const account = useAppSelector(state => selectAccountById(state, accountId))
  const [showMenu, setShowMenu] = useState(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
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

  const handleShowConfirmModal = () => {
    setConfirmDelete(true)
    setShowConfirmDelete(true)
  }
  const handleCloseConfirmModal = () => {
    setConfirmDelete(false)
    setShowConfirmDelete(false)
  }
  const handleClickDelete = async (
    e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>,
  ) => {
    if (confirmDelete) {
      const response = await balance.account.remove([accountId])
      if (!(response instanceof ApiError)) {
        dispatch(removeAccountThunk({ accountIds: [accountId] }))
        setConfirmDelete(false)
      }
    } else {
      setShowConfirmDelete(true)
      setConfirmDelete(true)
    }
  }

  useEffect(() => {
    document.addEventListener("click", handleClickMenu)
    return () => document.removeEventListener("click", handleClickMenu)
  }, [setShowMenu, menuRef, handleClickMenu])

  return (
    <div>
      <div className="border-4 border-grass-300 rounded-lg p-4 h-full relative">
        <div
          ref={menuRef}
          className="absolute right-1 top-1 rounded-md p-1
        text-grass-400
        hover:cursor-pointer hover:bg-grass-200 hover:text-grass-700"
          onClick={e => setShowMenu(!showMenu)}
        >
          <EllipsisVertical />
        </div>
        {showMenu && (
          <div
            onClick={handleShowConfirmModal}
            className="absolute top-10 right-1 px-2 py-2 rounded-lg
            flex 
          bg-white border-2 border-grass-300 hover:cursor-pointer hover:bg-grass-300"
          >
            <FileX />
            Delete Account
          </div>
        )}
        <div className="text-wrap">
          <span className="font-bold">ID: </span>
          <pre className="text-wrap inline">{account.id}</pre>
        </div>
        <div>
          <span className="font-bold">Name: </span>
          {account.name}
        </div>
        <div>
          <span className="font-bold">Type: </span>
          {account.accountType}
        </div>
      </div>
      <AnimatePresence>
        {showConfirmDelete && (
          <Modal
            selector="#authNode"
            closeModal={handleCloseConfirmModal}
            element={
              <ConfirmDelete
                closeModal={handleCloseConfirmModal}
                onDelete={handleClickDelete}
              />
            }
          />
        )}
      </AnimatePresence>
    </div>
  )
}
