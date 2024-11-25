import { uuidv7 } from "uuidv7"
import { Prisma } from "@prisma/client"
import { cleanName } from "../../src/utils/helpers/cleanName"
import { users } from "./users"

const userIds = users.map(user => user.id)

export const user1Budgets: Prisma.BudgetCreateManyInput[] = [
  {
    id: uuidv7(),
    name: "My First Budget",
    cleanedName: cleanName("My First Budget"),
    userId: userIds[0],
  },
]

const budgetNames = [
  "My First Budget",
  "The Year of Money",
  "wall Street gainz",
  "The Wolf",
]
export const allBudgets: Prisma.BudgetCreateManyInput[] = userIds.map(
  (u, i) => {
    return {
      id: uuidv7(),
      name: budgetNames[i],
      cleanedName: cleanName(budgetNames[i]),
      userId: u,
    }
  }
)
