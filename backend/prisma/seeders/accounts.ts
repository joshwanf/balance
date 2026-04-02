import { uuidv7 } from "uuidv7"
import { Prisma } from "@prisma/client"
import { cleanName } from "../../src/utils/helpers/cleanName"

export const makeAccounts = (
  userId: string,
): Prisma.AccountCreateManyInput[] => [
  {
    id: uuidv7(),
    name: "Schwab Checking",
    cleanedName: cleanName("Schwab Checking"),
    accountType: "checking",
    // initialBalance: 5000,
    userId: userId,
  },
  {
    id: uuidv7(),
    name: "Sapphire Reserved",
    cleanedName: cleanName("Sapphire Reserved"),
    accountType: "credit",
    // initialBalance: 10000,
    userId: userId,
  },
  {
    id: uuidv7(),
    name: "Amex Platinum",
    cleanedName: cleanName("Amex Platinum"),
    accountType: "credit",
    // initialBalance: 100,
    userId: userId,
  },
]
