"use client"
import { PrimaryButton } from "../../lib/Base/Button"
interface Props {
  closeModal: () => void
  deleteT: (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => void
}
export const ConfirmDelete = ({ closeModal, deleteT, ...rest }: Props) => {
  return (
    <div className="bg-surface p-6 space-y-2 rounded-md">
      <div>Are you sure you want to delete the transaction?</div>
      <div className="space-x-4">
        <PrimaryButton
          additionalClasses={[
            "px-6",
            "py-0.5",
            "rounded-md",
            "font-semibold",
            "hover:text-surface",
          ]}
          onClick={deleteT}
          classSchema={{
            bgColor: "bg-neutral-200",
            hoverBgColor: "hover:bg-danger-700",
            borderColor: "bg-neutral-200",
            hoverBorderColor: "hover:bg-danger-700",
            textColor: "text-danger-600",
          }}
        >
          Delete
        </PrimaryButton>
        <PrimaryButton
          additionalClasses={[
            "px-6",
            "py-0.5",
            "rounded-md",
            "bg-neutral-500",
            "text-surface",
            "font-semibold",
            "hover:bg-neutral-400",
          ]}
          onClick={closeModal}
        >
          Cancel
        </PrimaryButton>
      </div>
    </div>
  )
}
