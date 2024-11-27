import { uuidv7 } from "uuidv7"
import { Prisma } from "@prisma/client"
import { cleanName } from "../../src/utils/helpers/cleanName"
import { users } from "./users"

const userIds = users.map(user => user.id)
export const user1Cat: Prisma.CategoryCreateManyInput[] = [
  /** user 1 */
  {
    id: uuidv7(),
    name: "Basics",
    cleanedName: cleanName("Basics"),
    userId: userIds[0],
  },
  {
    id: uuidv7(),
    name: "Groceries",
    cleanedName: cleanName("Groceries"),
    userId: userIds[0],
  },
  {
    id: uuidv7(),
    name: "Travel",
    cleanedName: cleanName("Travel"),
    userId: userIds[0],
  },
]
export const user2Cat: Prisma.CategoryCreateManyInput[] = [
  /** user 2 */
  {
    id: uuidv7(),
    name: "Wedding",
    cleanedName: cleanName("Wedding"),
    userId: userIds[1],
  },
]

export const categories = [...user1Cat, ...user2Cat]
