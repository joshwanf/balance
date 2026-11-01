"use client"
import * as Btn from "../Base/Button"
interface Props {}
export const AllButtons = () => {
  return (
    <div>
      <div>
        <h1>Default buttons</h1>
        <Btn.PrimaryButton>Primary Button</Btn.PrimaryButton>
        <Btn.SecondaryButton>Secondary Button</Btn.SecondaryButton>
        <Btn.TertiaryButton>Tertiary Button</Btn.TertiaryButton>
      </div>
      <div>
        <h1>
          Class names can be overridden with the <code>additionalClasses</code>{" "}
          prop
        </h1>
        <Btn.PrimaryButton
          additionalClasses={[
            "bg-success-500",
            "border-success-500",
            "hover:bg-success-400",
            "hover:border-success-400",
            "active:bg-success-600",
            "active:border-success-600",
          ]}
        >
          Primary Button
        </Btn.PrimaryButton>
      </div>
    </div>
  )
}
