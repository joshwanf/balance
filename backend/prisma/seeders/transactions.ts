import { uuidv7 } from "uuidv7"
import { Prisma } from "@prisma/client"
import { users } from "./users"
import { accounts } from "./accounts"
import { user1Cat, user2Cat } from "./categories"

const userIds = users.map(u => u.id)
const accountIds = accounts.map(a => a.id)
const user1CatIds = user1Cat.map(c => c.id)
const user2CatIds = user2Cat.map(c => c.id)

export const transactions: Prisma.TransactionCreateManyInput[] = [
  {
    id: uuidv7(),
    payee: "Landlord",
    type: "outgoing",
    amount: 160000,
    date: "2024-10-01",
    userId: userIds[0],
    accountId: accountIds[0],
    categoryId: user1CatIds[0],
  },
  {
    id: uuidv7(),
    payee: "PECO",
    type: "outgoing",
    amount: 10803,
    date: "2024-10-05",
    userId: userIds[0],
    accountId: accountIds[0],
    categoryId: user1CatIds[0],
  },
  {
    id: uuidv7(),
    payee: "Whole Foods",
    type: "outgoing",
    amount: 10426,
    date: "2024-10-02",
    userId: userIds[0],
    accountId: accountIds[0],
    categoryId: user1CatIds[1],
  },
  {
    id: uuidv7(),
    payee: "SEPTA",
    type: "outgoing",
    amount: 2000,
    date: "2024-10-10",
    userId: userIds[0],
    accountId: accountIds[0],
    categoryId: user1CatIds[2],
  },
  {
    id: uuidv7(),
    payee: "Uniqlo",
    type: "outgoing",
    amount: 15034,
    date: "2024-10-03",
    userId: userIds[0],
    accountId: accountIds[0],
  },
  {
    id: uuidv7(),
    payee: "Landlord",
    type: "outgoing",
    amount: 160000,
    date: "2024-11-01",
    userId: userIds[0],
    accountId: accountIds[0],
    categoryId: user1CatIds[0],
  },
  {
    id: uuidv7(),
    payee: "PECO",
    type: "outgoing",
    amount: 9500,
    date: "2024-11-05",
    userId: userIds[0],
    accountId: accountIds[0],
    categoryId: user1CatIds[0],
  },
  {
    id: uuidv7(),
    payee: "Whole Foods",
    type: "outgoing",
    amount: 7500,
    date: "2024-11-02",
    userId: userIds[0],
    accountId: accountIds[0],
    categoryId: user1CatIds[1],
  },
  {
    id: uuidv7(),
    payee: "SEPTA",
    type: "outgoing",
    amount: 1000,
    date: "2024-11-10",
    userId: userIds[0],
    accountId: accountIds[0],
    categoryId: user1CatIds[2],
  },
  {
    id: uuidv7(),
    payee: "Sur La Table",
    type: "outgoing",
    amount: 10636,
    date: "2024-11-15",
    userId: userIds[0],
    accountId: accountIds[0],
  },
]
