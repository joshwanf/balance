type MonthlyAggregates = {
  _sum: { amount: number | null }
  categoryId: string | null
}[]
export const monthlyCatAggToMap = (monthlyAggregates: MonthlyAggregates[]) => {
  return monthlyAggregates.map(
    outgoing =>
      new Map(
        outgoing.map(c => {
          const id = c.categoryId || "unassigned"
          const amount = c._sum.amount ? c._sum.amount : 0
          return [id, amount]
        })
      )
  )
}

type TransactionQuery = {
  category: {
    id: string
    name: string
  } | null
  id: string
  type: string
  payee: string
  amount: number
  date: string
  userId: string
  accountId: string
  categoryId: string | null
}
type FlatQuery = Omit<TransactionQuery, "category"> & {
  category: string | null
}
export const flatten = (queryResult: TransactionQuery[]): FlatQuery[] => {
  return queryResult.map(t => ({
    ...t,
    category: t?.category?.name || null,
  }))
}

export const groupBy = (
  flatQueryResults: FlatQuery[],
  grouping: keyof FlatQuery
) => {
  const groupedResult: Record<string, FlatQuery[]> = {}
  for (const r of flatQueryResults) {
    const groupingValue = r[grouping] || "unassigned"
    if (typeof groupingValue === "number") {
      throw "Grouping values must be a string."
    }
    if (Object.keys(groupedResult).includes(groupingValue)) {
      groupedResult[groupingValue].push(r)
    } else {
      groupedResult[groupingValue] = [r]
    }
  }
  return groupedResult
}

type KeysMatchingType<T, V> = {
  [K in keyof T]-?: T[K] extends V ? K : never
}[keyof T]

export const groupTransactionsAndSum = (
  transactions: TransactionQuery[],
  grouping: KeysMatchingType<FlatQuery, string | null>,
  sumOn: KeysMatchingType<FlatQuery, number>
) => {
  const flat = flatten(transactions)
  const grouped = groupBy(flat, grouping)
  const sums = Object.entries(grouped).map(([category, g]) => {
    const sum = g.reduce((a, b) => a + b[sumOn], 0)
    return { name: category, spent: sum }
  })
  return sums
}
