import { getSessionUser } from "@/server/auth"
import { listCategories } from "@/server/data"
import { CategoryTable } from "./CategoryTable"

interface Props {
  month: string
}

/** Fetches the month's categories on the server and renders the table. */
export const CategoryList = async ({ month }: Props) => {
  const user = await getSessionUser()
  if (!user) return null
  const categories = await listCategories(user.id, month)
  return <CategoryTable categories={categories} />
}
