"use client"
import { useTransition } from "react"
import { PrimaryButton } from "../../lib/Base/Button"
import { deleteAccountAction } from "@/server/actions/account"
import { LoadingSpinner } from "@/components/Skeletons/LoadingSpinner"
interface Props {
  accountId: string
  closeModal: () => void
}
export const ConfirmDelete = ({ accountId, closeModal }: Props) => {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteAccountAction(accountId)
      if (result.status === "success") closeModal()
    })
  }

  return (
    <div className="bg-white p-6 space-y-2 rounded-md">
      <div>
        Are you sure you want to delete the account? All its transactions will
        be deleted as well.
      </div>
      <div className="space-x-4">
        <PrimaryButton
          additionalClasses={[
            "px-6",
            "py-0.5",
            "rounded-md",
            "font-semibold",
            "hover:text-white",
          ]}
          onClick={handleDelete}
          classSchema={{
            bgColor: "bg-slate-200",
            hoverBgColor: "hover:bg-red-700",
            borderColor: "bg-slate-200",
            hoverBorderColor: "hover:bg-red-700",
            textColor: "text-red-600",
          }}
        >
          <div className="flex gap-2 items-center justify-center">
            {isPending && <LoadingSpinner />}Delete
          </div>
        </PrimaryButton>
        <PrimaryButton
          additionalClasses={[
            "px-6",
            "py-0.5",
            "rounded-md",
            "bg-slate-500",
            "text-white",
            "font-semibold",
            "hover:bg-slate-400",
          ]}
          onClick={closeModal}
        >
          Cancel
        </PrimaryButton>
      </div>
    </div>
  )
}
