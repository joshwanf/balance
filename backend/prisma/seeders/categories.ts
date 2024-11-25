import { uuidv7 } from "uuidv7"
import { Prisma } from "@prisma/client"
import { cleanName } from "../../src/utils/helpers/cleanName"
import { users } from "./users"

const userIds = users.map(user => user.id)
export const categories: Prisma.CategoryCreateManyInput[] = [
  /** user 1 */
  {
    id: uuidv7(),
    name: "Basics",
    cleanedName: cleanName("Basics"),
    amount: 2000.0,
    userId: userIds[0],
  },
  {
    id: uuidv7(),
    name: "Groceries",
    cleanedName: cleanName("Groceries"),
    amount: 400.0,
    userId: userIds[0],
  },
  {
    id: uuidv7(),
    name: "Travel",
    cleanedName: cleanName("Travel"),
    amount: 500.0,
    userId: userIds[0],
  },
  /** user 2 */
  {
    id: uuidv7(),
    name: "Wedding",
    cleanedName: cleanName("Wedding"),
    amount: 4000.0,
    userId: userIds[1],
  },
]
