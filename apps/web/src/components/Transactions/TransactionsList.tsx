import { getSessionUser } from "@/server/auth"
import {
  listTagNames,
  listTransactionRows,
  searchTransactions,
} from "@/server/data"
import { searchTextToParams } from "../../utils/searchHelpers"
import { TransactionsTable } from "./TransactionsTable"

interface Props {
  accounts: { id: string; name: string }[]
  month: string
  /** raw search text from ?q=; when set, search across all months */
  searchText: string
}

/** Fetches the month (or the search) on the server and renders the table. */
export const TransactionsList = async ({
  accounts,
  month,
  searchText,
}: Props) => {
  const user = await getSessionUser()
  if (!user) return null

  const [rows, allTags] = await Promise.all([
    searchText
      ? search(user.id, searchText)
      : listTransactionRows(user.id, month),
    listTagNames(user.id),
  ])

  return (
    <TransactionsTable
      accounts={accounts}
      transactions={rows}
      allTags={allTags}
    />
  )
}

const search = async (userId: string, searchText: string) => {
  const { generalSearch, tags, startDate, endDate } =
    searchTextToParams(searchText)
  const res = await searchTransactions(userId, {
    terms: generalSearch,
    tags,
    startDate,
    endDate,
  })
  return res.transactions
}
