// import { uuidv7 } from "uuidv7"
import { Prisma } from "@prisma/client"
import { cleanName } from "../../../utils/helpers/cleanName"
import { users } from "./users"
// import { user1Budgets } from "./budgets"
// import { user1Categories } from "./categories"

const userIds = users.map((user) => user.id)
// const budgetIds = user1Budgets.map((budget) => budget.id)
// const categoryIds = user1Categories.map((category) => category.id)

export const user1Groups: Prisma.GroupCreateManyInput[] = [
  {
    userId: userIds[0],
    itemCleanedName: cleanName("Rent"),
  },
]

export const user2Groups: Prisma.GroupCreateManyInput[] = []
