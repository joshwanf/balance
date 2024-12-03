import { PrimaryButton } from "../../lib/Base/Button"
interface Props {
  closeModal: () => void
  onDelete: (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => void
}
export const ConfirmDelete: React.FC<Props> = props => {
  const { closeModal, onDelete, ...rest } = props
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
          onClick={onDelete}
          classSchema={{
            bgColor: "bg-slate-200",
            hoverBgColor: "hover:bg-red-700",
            borderColor: "bg-slate-200",
            hoverBorderColor: "hover:bg-red-700",
            textColor: "text-red-600",
          }}
        >
          Delete
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
