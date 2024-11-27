import { uuidv7 } from "uuidv7"
import { Prisma } from "@prisma/client"
import { cleanName } from "../../src/utils/helpers/cleanName"
import { users } from "./users"
import { user1Cat, user2Cat } from "./categories"

const userIds = users.map(user => user.id)
const user1CatIds = user1Cat.map(cat => cat.id)
const user2CatIds = user2Cat.map(cat => cat.id)

export const categoryMonths: Prisma.CategoryMonthCreateManyInput[] = [
  /** user 1 */
  {
    id: uuidv7(),
    userId: userIds[0],
    categoryId: user1CatIds[0],
    month: "2024-11",
    amount: 300000,
  },
  {
    id: uuidv7(),
    userId: userIds[0],
    categoryId: user1CatIds[0],
    month: "2024-12",
    amount: 300000,
  },
  {
    id: uuidv7(),
    userId: userIds[0],
    categoryId: user1CatIds[1],
    month: "2024-11",
    amount: 40000,
  },
  {
    id: uuidv7(),
    userId: userIds[0],
    categoryId: user1CatIds[1],
    month: "2024-12",
    amount: 40000,
  },
  {
    id: uuidv7(),
    userId: userIds[0],
    categoryId: user1CatIds[2],
    month: "2024-11",
    amount: 300000,
  },
  /** user 2 */
  {
    id: uuidv7(),
    userId: userIds[1],
    categoryId: user2CatIds[0],
    month: "2024-11",
    amount: 500000,
  },
]
