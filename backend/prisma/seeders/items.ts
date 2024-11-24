import { uuidv7 } from "uuidv7"
import { Prisma } from "@prisma/client"
import { cleanName } from "../../src/utils/helpers/cleanName"
import { users } from "./users"
import { user1Budgets } from "./budgets"
import { user1Categories } from "./categories"

const userIds = users.map((user) => user.id)
const budgetIds = user1Budgets.map((budget) => budget.id)
const categoryIds = user1Categories.map((category) => category.id)

export const user1Items: Prisma.ItemCreateManyInput[] = [
  {
    id: uuidv7(),
    // userId: userIds[0],
    budgetId: budgetIds[0],
    categoryId: categoryIds[0],
    name: "Rent",
    cleanedName: cleanName("Rent"),
  },
]

export const user2CategoryItemsData: Prisma.ItemCreateManyInput[] = []
