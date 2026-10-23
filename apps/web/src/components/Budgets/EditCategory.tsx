"use client"
interface Props {
  id: string | null
  submitEdit: () => void
}
export const EditCategory = ({ id, submitEdit, ...rest }: Props) => {
  if (!id) {
    return (
      <div>
        <div>edit name (no cat)</div>
        <div>edit budgeted amount</div>
      </div>
    )
  }
  return (
    <div className="flex justify-around">
      <div>edit name</div>
      <div>edit budgeted amount</div>
      <button onClick={submitEdit}>Submit</button>
    </div>
  )
}
