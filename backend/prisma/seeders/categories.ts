import { uuidv7 } from "uuidv7"
import { Prisma } from "@prisma/client"
import { cleanName } from "../../src/utils/helpers/cleanName"
import { users } from "./users"
import { user1Budgets } from "./budgets"

const userIds = users.map((user) => user.id)
const budgetIds = user1Budgets.map((budget) => budget.id)

export const user1Categories: Prisma.CategoryCreateManyInput[] = [
  {
    id: uuidv7(),
    userId: userIds[0],
    budgetId: budgetIds[0],
    name: "Basics",
    cleanedName: cleanName("Basics"),
  },
]

export const user2Categories: Prisma.CategoryCreateManyInput[] = []
