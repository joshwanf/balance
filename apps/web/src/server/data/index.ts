/**
 * Data functions shared by the API route handlers and Server Components,
 * so a page and its endpoint always return the same shapes.
 */
export { listTransactions, searchTransactions } from "./transactions"
export type { TransactionSearch } from "./transactions"
export { trendOverview, trendCompare } from "./trends"
export {
  getCategoriesWithTransAgg as listCategories,
  getCategoryForMonth,
  getAccountsWithTransAgg,
  getUserWithRelations,
} from "../queries"

import { getAccountsWithTransAgg } from "../queries"
/** All of the user's accounts with their totals for a month. */
export const listAccounts = (userId: string, month: string) =>
  getAccountsWithTransAgg(userId, undefined, month)
