import { useState } from "react"
import * as Ipt from "../lib/Base/Input"

interface Props {}
export const AllInputs: React.FC<Props> = ({}) => {
  const [textareaContent, setTextareaContent] = useState("")
  const [textInputContent, setTextInputContent] = useState("")
  const [checkboxIsChecked, setCheckboxIsChecked] = useState<boolean>(false)
  const manyCheckboxesOptions = [
    { text: "Sample option 1", isDisabled: false },
    { text: "Sample option 2", isDisabled: false },
    { text: "Sample option 3", isDisabled: true },
  ]
  const [manyCheckboxesIsChecked, setManyCheckboxesIsChecked] = useState<
    boolean[]
  >(manyCheckboxesOptions.map(box => false))
  return (
    <div>
      <div className="p-3 m-3 border border-slate-400 rounded-md relative">
        <h1 className="px-2 absolute -top-3 bg-white">Default Inputs</h1>
        <div>
          <fieldset>
            <legend>
              <h2>Textarea</h2>
            </legend>
            <Ipt.TextArea
              text={textareaContent}
              onChange={setTextareaContent}
            />
          </fieldset>
        </div>
        <div>
          <h2>Input</h2>
          <Ipt.TextInput
            text={textInputContent}
            onChange={setTextInputContent}
          />
        </div>
        <div>
          <h2>Checkbox</h2>
          <Ipt.Checkbox
            text="Sample option"
            id="Sample option"
            disabled={false}
            checked={checkboxIsChecked}
            onChange={setCheckboxIsChecked}
          />
        </div>
        <div>
          <h2>Many Checkboxes</h2>
          <Ipt.ManyCheckboxes
            options={manyCheckboxesOptions}
            selected={manyCheckboxesIsChecked}
            onChange={setManyCheckboxesIsChecked}
          />
        </div>
      </div>
      <div>
        <h1>
          Class names can be overridden with the <code>additionalClasses</code>{" "}
          prop
        </h1>
      </div>
    </div>
  )
}
