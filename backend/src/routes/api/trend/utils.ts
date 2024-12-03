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
