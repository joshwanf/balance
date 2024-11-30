import { useState } from "react"

// import { PrimaryButton } from "../lib/Base/Button/PrimaryButton"
import * as Btn from "../Base/Button"

import { AllButtons } from "./AllButtons"
import { AllInputs } from "./AllInputs"
import { LoginForm } from "./LoginForm"
// import { LanguageTags } from "./LanguageTags"

export const ComponentSelector = () => {
  const [selectedComponent, setSelectedComponent] = useState<number>(0)
  const components = [
    { name: "Buttons", component: <AllButtons /> },
    { name: "Inputs", component: <AllInputs /> },
    { name: "LoginForm", component: <LoginForm /> },
    // { name: "LanguageTags", component: <LanguageTags /> },
  ]

  return (
    <div>
      <p>Component selector</p>
      {components.map((c, i) => (
        <Btn.PrimaryButton key={i} onClick={() => setSelectedComponent(i)}>
          {c.name}
        </Btn.PrimaryButton>
      ))}
      {components[selectedComponent].component}
    </div>
  )
}
