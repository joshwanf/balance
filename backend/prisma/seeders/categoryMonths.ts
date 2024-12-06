import { uuidv7 } from "uuidv7"
import { Prisma } from "@prisma/client"
import { cleanName } from "../../src/utils/helpers/cleanName"
import { users } from "./users"
import { user1Cat, user2Cat } from "./categories"

const userIds = users.map(user => user.id)
const user1CatIds = user1Cat.map(cat => cat.id)
const user2CatIds = user2Cat.map(cat => cat.id)

export const user1CategoryMonths: Prisma.CategoryMonthCreateManyInput[] = [
  /** user 1 */
  {
    id: uuidv7(),
    userId: userIds[0],
    categoryId: user1CatIds[0], // Basics
    month: "2024-11",
    amount: 400000,
  },
  {
    id: uuidv7(),
    userId: userIds[0],
    categoryId: user1CatIds[1], // Dining out
    month: "2024-11",
    amount: 200000,
  },
  {
    id: uuidv7(),
    userId: userIds[0],
    categoryId: user1CatIds[2], // Fitness
    month: "2024-11",
    amount: 40000,
  },
  {
    id: uuidv7(),
    userId: userIds[0],
    categoryId: user1CatIds[3], // Shopping
    month: "2024-11",
    amount: 150000,
  },
  {
    id: uuidv7(),
    userId: userIds[0],
    categoryId: user1CatIds[4], // Groceries
    month: "2024-11",
    amount: 25000,
  },
  {
    id: uuidv7(),
    userId: userIds[0],
    categoryId: user1CatIds[5], // Transportation
    month: "2024-11",
    amount: 20000,
  },
  {
    id: uuidv7(),
    userId: userIds[0],
    categoryId: user1CatIds[6], // Travel
    month: "2024-11",
    amount: 800000,
  },
]
export const user2CategoryMonths = user1CategoryMonths.map(c => ({
  ...c,
  id: uuidv7(),
  userId: userIds[1],
}))
export const user3CategoryMonths: Prisma.CategoryMonthCreateManyInput[] = [
  /** user 2 */
  {
    id: uuidv7(),
    userId: userIds[1],
    categoryId: user2CatIds[0],
    month: "2024-11",
    amount: 500000,
  },
]

export const categoryMonths = [
  ...user1CategoryMonths,
  ...user2CategoryMonths,
  ...user3CategoryMonths,
]
