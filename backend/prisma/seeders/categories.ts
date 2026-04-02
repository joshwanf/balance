import { uuidv7 } from "uuidv7"
import { Prisma } from "@prisma/client"
import { cleanName } from "../../src/utils/helpers/cleanName"

export const makeCategories = (
  userId: string,
): Prisma.CategoryCreateManyInput[] => [
  {
    id: uuidv7(),
    name: "Incoming",
    cleanedName: cleanName("Incoming"),
    userId: userId,
  },
  {
    id: uuidv7(),
    name: "Dining Out",
    cleanedName: cleanName("Dining Out"),
    userId: userId,
  },
  {
    id: uuidv7(),
    name: "Fitness",
    cleanedName: cleanName("Fitness"),
    userId: userId,
  },
  {
    id: uuidv7(),
    name: "Shopping",
    cleanedName: cleanName("Shopping"),
    userId: userId,
  },
  {
    id: uuidv7(),
    name: "Groceries",
    cleanedName: cleanName("Groceries"),
    userId: userId,
  },
  {
    id: uuidv7(),
    name: "Transportaion",
    cleanedName: cleanName("Transportaion"),
    userId: userId,
  },
  {
    id: uuidv7(),
    name: "Travel",
    cleanedName: cleanName("Travel"),
    userId: userId,
  },
]
