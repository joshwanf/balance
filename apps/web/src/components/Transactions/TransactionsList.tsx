import { getSessionUser } from "@/server/auth"
import {
  listAccounts,
  listCategories,
  listTransactions,
  searchTransactions,
} from "@/server/data"
import { pc } from "@/server/prisma"
import { searchTextToParams } from "../../utils/searchHelpers"
import { TransactionsTable } from "./TransactionsTable"

interface Props {
  month: string
  /** raw search text from ?q=; when set, search across all months */
  searchText: string
}

/** Fetches the month (or the search) on the server and renders the table. */
export const TransactionsList = async ({ month, searchText }: Props) => {
  const user = await getSessionUser()
  if (!user) return null

  const [rows, categories, accounts, tags] = await Promise.all([
    searchText ? search(user.id, searchText) : listTransactions(user.id, month),
    listCategories(user.id, month),
    listAccounts(user.id, month),
    pc.tags.findMany({ where: { userId: user.id }, select: { name: true } }),
  ])

  return (
    <TransactionsTable
      transactions={rows.transactions}
      accountNames={Object.fromEntries(accounts.map(a => [a.id, a.name]))}
      categoryNames={Object.fromEntries(categories.map(c => [c.id, c.name]))}
      allTags={tags.map(t => t.name)}
    />
  )
}

const search = (userId: string, searchText: string) => {
  const { generalSearch, tags, startDate, endDate } =
    searchTextToParams(searchText)
  return searchTransactions(userId, {
    terms: generalSearch,
    tags,
    startDate,
    endDate,
  })
}
