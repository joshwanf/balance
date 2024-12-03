import { useState } from "react"
import { CreateAccountButton } from "./CreateAccountButton"
import { CreateAccountForm } from "./CreateAccountForm"

interface Props {
  onAfterSubmitForm: () => void
}
export const CreateAccountCard: React.FC<Props> = props => {
  const { onAfterSubmitForm, ...rest } = props
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState({ name: "", type: "", initialBalance: "" })

  return (
    <div>
      <div
        className="border-4 border-dashed border-grass-300 rounded-lg 
                  w-full h-full flex flex-col items-center justify-center "
      >
        {!isEditing ? (
          <CreateAccountButton onClick={() => setIsEditing(true)} />
        ) : (
          <CreateAccountForm closeForm={() => setIsEditing(false)} />
        )}
      </div>
    </div>
  )
}
