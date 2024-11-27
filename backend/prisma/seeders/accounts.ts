import { uuidv7 } from "uuidv7"
import { Prisma } from "@prisma/client"
import { cleanName } from "../../src/utils/helpers/cleanName"

import { users } from "./users"

const userIds = users.map(u => u.id)
export const accounts: Prisma.AccountCreateManyInput[] = [
  {
    id: uuidv7(),
    name: "Schwab Checking",
    cleanedName: cleanName("Schwab Checking"),
    accountType: "checking",
    // initialBalance: 5000,
    userId: userIds[0],
  },
  {
    id: uuidv7(),
    name: "Chase Private Client",
    cleanedName: cleanName("Chase Private Client"),
    accountType: "savings",
    // initialBalance: 10000,
    userId: userIds[0],
  },
  {
    id: uuidv7(),
    name: "BOA",
    cleanedName: cleanName("BOA"),
    accountType: "checking",
    // initialBalance: 100,
    userId: userIds[1],
  },
  {
    id: uuidv7(),
    name: "Bank of America",
    cleanedName: cleanName("Bank of America"),
    accountType: "checking",
    // initialBalance: 40000,
    userId: userIds[2],
  },
]
