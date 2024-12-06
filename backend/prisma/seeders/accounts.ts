import { uuidv7 } from "uuidv7"
import { Prisma } from "@prisma/client"
import { cleanName } from "../../src/utils/helpers/cleanName"

import { users } from "./users"

const userIds = users.map(u => u.id)
export const user1Accounts: Prisma.AccountCreateManyInput[] = [
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
    name: "Sapphire Reserved",
    cleanedName: cleanName("Sapphire Reserved"),
    accountType: "credit",
    // initialBalance: 10000,
    userId: userIds[0],
  },
  {
    id: uuidv7(),
    name: "Amex Platinum",
    cleanedName: cleanName("Amex Platinum"),
    accountType: "credit",
    // initialBalance: 100,
    userId: userIds[0],
  },
]
export const user2Accounts = user1Accounts.map(a => ({
  ...a,
  id: uuidv7(),
  userId: userIds[1],
}))

export const user3Accounts: Prisma.AccountCreateManyInput[] = [
  {
    id: uuidv7(),
    name: "Bank of America",
    cleanedName: cleanName("Bank of America"),
    accountType: "checking",
    // initialBalance: 40000,
    userId: userIds[2],
  },
]

export const accounts = [...user1Accounts, ...user2Accounts, ...user3Accounts]
