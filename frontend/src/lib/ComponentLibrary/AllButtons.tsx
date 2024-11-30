import * as Btn from "../Base/Button"
interface Props {}
export const AllButtons: React.FC<Props> = ({}) => {
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
            "bg-green-500",
            "border-green-500",
            "hover:bg-green-400",
            "hover:border-green-400",
            "active:bg-green-600",
            "active:border-green-600",
          ]}
        >
          Primary Button
        </Btn.PrimaryButton>
      </div>
    </div>
  )
}
