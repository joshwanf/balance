import { FilePlus } from "lucide-react"
import { motion } from "motion/react"
import { useState } from "react"
import { TextInput } from "../../lib/Base/Input"

interface Props {
  onAfterSubmitForm: () => void
}
export const CreateAccount: React.FC<Props> = props => {
  const { onAfterSubmitForm, ...rest } = props
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState({ name: "", type: "" })

  const handleChangeForm = (field: string) => (value: string) => {
    setForm({ ...form, [field]: value })
  }
  return (
    <div>
      {!isEditing ? (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsEditing(true)}
          className="border-4 border-dashed border-grass-300 rounded-lg 
      hover:cursor-pointer
      p-4 w-full h-full flex flex-col items-center justify-center text-grass-400"
        >
          <FilePlus />
          <div>Add a new account</div>
        </motion.button>
      ) : (
        <div>
          Name:{" "}
          <TextInput text={form.name} onChange={handleChangeForm("name")} />
        </div>
      )}
    </div>
  )
}
