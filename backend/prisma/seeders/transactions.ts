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
    amount: 160000,
    date: new Date("2024-11-01"),
  },
  {
    id: uuidv7(),
    userId: userIds[0],
    // categoryItemId: categoryItemIds[0],
    payee: "Whole Foods Market",
    amount: 5400,
    date: new Date("2024-11-03"),
  },
  {
    id: uuidv7(),
    userId: userIds[0],
    // categoryItemId: categoryItemIds[0],
    payee: "Target",
    amount: 7536,
    date: new Date("2024-11-03"),
  },
  {
    id: uuidv7(),
    userId: userIds[0],
    // categoryItemId: categoryItemIds[0],
    payee: "Vernick Pizza",
    amount: 2296,
    date: new Date("2024-11-03"),
  },
  {
    id: uuidv7(),
    userId: userIds[0],
    // categoryItemId: categoryItemIds[0],
    payee: "Uber Technologies",
    amount: 1495,
    date: new Date("2024-11-03"),
  },
]

export const user2Transactions: Prisma.TransactionCreateManyInput[] = []
