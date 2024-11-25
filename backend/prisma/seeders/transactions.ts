import { uuidv7 } from "uuidv7"
import { Prisma } from "@prisma/client"
import { users } from "./users"
import { accounts } from "./accounts"

const userIds = users.map(u => u.id)
const accountIds = accounts.map(a => a.id)
export const transactions: Prisma.TransactionCreateManyInput[] = [
  {
    id: uuidv7(),
    payee: "Landlord",
    type: "outgoing",
    amount: 1600.0,
    date: new Date("2024-11-01T00:00:00-04:00"),
    userId: userIds[0],
    accountId: accountIds[0],
  },
  {
    id: uuidv7(),
    payee: "Whole Foods",
    type: "outgoing",
    amount: 75.0,
    date: new Date("2024-11-02T00:00:00-04:00"),
    userId: userIds[0],
    accountId: accountIds[0],
  },
  {
    id: uuidv7(),
    payee: "Whole Foods",
    type: "outgoing",
    amount: 75.0,
    date: new Date("2024-11-02T00:00:00-04:00"),
    userId: userIds[0],
    accountId: accountIds[0],
  },
]

export const user2Transactions: Prisma.TransactionCreateManyInput[] = []
