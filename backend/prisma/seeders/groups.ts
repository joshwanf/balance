// import { uuidv7 } from "uuidv7"
import { Prisma } from "@prisma/client"
import { cleanName } from "../../src/utils/helpers/cleanName"
import { users } from "./users"
// import { user1Budgets } from "./budgets"
// import { user1Categories } from "./categories"
import { user1Items } from "./items"

const userIds = users.map((user) => user.id)
const firstItemId = user1Items.map((item) => item.id)[0]
// const budgetIds = user1Budgets.map((budget) => budget.id)
// const categoryIds = user1Categories.map((category) => category.id)

export const user1Groups: Prisma.UserGroupCreateManyInput[] = [
  {
    userId: userIds[0],
    // itemCleanedName: cleanName("Rent"),
    itemId: firstItemId,
  },
]

export const user2Groups: Prisma.UserGroupCreateManyInput[] = []
