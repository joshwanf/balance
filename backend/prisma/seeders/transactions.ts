import { uuidv7 } from "uuidv7"
import { Prisma } from "@prisma/client"
import { users } from "./users"
// import { user1Budgets } from "./budgets"
// import { user1Categories } from "./categories"
import { user1Items } from "./items"

const userIds = users.map((user) => user.id)
// const budgetIds = user1BudgetsData.map((budget) => budget.id)
// const categoryIds = user1CategoriesData.map((category) => category.id)
const categoryItemIds = user1Items.map((item) => item.id)

export const user1Transactions: Prisma.TransactionCreateManyInput[] = [
  {
    id: uuidv7(),
    userId: userIds[0],
    itemId: categoryItemIds[0],
    payee: "Landlord",
    amount: "1600.00",
    date: "2024-11-01",
  },
  {
    id: uuidv7(),
    userId: userIds[0],
    // categoryItemId: categoryItemIds[0],
    payee: "Whole Foods Market",
    amount: "54.00",
    date: "2024-11-01",
  },
  {
    id: uuidv7(),
    userId: userIds[0],
    // categoryItemId: categoryItemIds[0],
    payee: "Target",
    amount: "75.36",
    date: "2024-11-01",
  },
  {
    id: uuidv7(),
    userId: userIds[0],
    // categoryItemId: categoryItemIds[0],
    payee: "Vernick Pizza",
    amount: "22.96",
    date: "2024-11-01",
  },
  {
    id: uuidv7(),
    userId: userIds[0],
    // categoryItemId: categoryItemIds[0],
    payee: "Uber Technologies",
    amount: "14.95",
    date: "2024-11-01",
  },
]

export const user2Transactions: Prisma.TransactionCreateManyInput[] = []
