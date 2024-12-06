import { uuidv7 } from "uuidv7"
import { Prisma } from "@prisma/client"
import { users } from "./users"
import { user1Accounts } from "./accounts"
import { user1Cat, user2Cat } from "./categories"

const userIds = users.map(u => u.id)
const accountIds = user1Accounts.map(a => a.id)
const user1CatIds = user1Cat.map(c => c.id)
const user2CatIds = user2Cat.map(c => c.id)

// export const transactions: Prisma.TransactionCreateManyInput[] = [
//   {
//     id: uuidv7(),
//     payee: "Landlord",
//     type: "outgoing",
//     amount: 160000,
//     date: "2024-11-01",
//     userId: userIds[0],
//     accountId: accountIds[0],
//     categoryId: user1CatIds[0],
//   },
//   {
//     id: uuidv7(),
//     payee: "PECO",
//     type: "outgoing",
//     amount: 10803,
//     date: "2024-11-05",
//     userId: userIds[0],
//     accountId: accountIds[0],
//     categoryId: user1CatIds[0],
//   },
//   {
//     id: uuidv7(),
//     payee: "Whole Foods",
//     type: "outgoing",
//     amount: 10426,
//     date: "2024-11-02",
//     userId: userIds[0],
//     accountId: accountIds[0],
//     categoryId: user1CatIds[1],
//   },
//   {
//     id: uuidv7(),
//     payee: "SEPTA",
//     type: "outgoing",
//     amount: 2000,
//     date: "2024-11-10",
//     userId: userIds[0],
//     accountId: accountIds[0],
//     categoryId: user1CatIds[2],
//   },
//   {
//     id: uuidv7(),
//     payee: "Uniqlo",
//     type: "outgoing",
//     amount: 15034,
//     date: "2024-11-03",
//     userId: userIds[0],
//     accountId: accountIds[0],
//   },
//   {
//     id: uuidv7(),
//     payee: "Landlord",
//     type: "outgoing",
//     amount: 160000,
//     date: "2024-11-01",
//     userId: userIds[0],
//     accountId: accountIds[0],
//     categoryId: user1CatIds[0],
//   },
//   {
//     id: uuidv7(),
//     payee: "PECO",
//     type: "outgoing",
//     amount: 9500,
//     date: "2024-11-05",
//     userId: userIds[0],
//     accountId: accountIds[0],
//     categoryId: user1CatIds[0],
//   },
//   {
//     id: uuidv7(),
//     payee: "Whole Foods",
//     type: "outgoing",
//     amount: 7500,
//     date: "2024-11-02",
//     userId: userIds[0],
//     accountId: accountIds[0],
//     categoryId: user1CatIds[1],
//   },
//   {
//     id: uuidv7(),
//     payee: "SEPTA",
//     type: "outgoing",
//     amount: 1000,
//     date: "2024-11-10",
//     userId: userIds[0],
//     accountId: accountIds[0],
//     categoryId: user1CatIds[2],
//   },
//   {
//     id: uuidv7(),
//     payee: "Sur La Table",
//     type: "outgoing",
//     amount: 10636,
//     date: "2024-11-15",
//     userId: userIds[0],
//     accountId: accountIds[0],
//   },
// ]

export const user1Transactions: Prisma.TransactionCreateManyInput[] = [
  {
    id: uuidv7(),
    payee: "Netflix",
    type: "outgoing",
    amount: 1500,
    date: "2024-10-03",
    userId: userIds[0],
    accountId: accountIds[1],
    categoryId: user1CatIds[3], // Shopping
  },
  {
    id: uuidv7(),
    payee: "Peloton",
    type: "outgoing",
    amount: 3999,
    date: "2024-10-07",
    userId: userIds[0],
    accountId: accountIds[2],
    categoryId: user1CatIds[2], // Fitness
  },
  {
    id: uuidv7(),
    payee: "Target",
    type: "outgoing",
    amount: 7890,
    date: "2024-10-12",
    userId: userIds[0],
    accountId: accountIds[1],
    categoryId: user1CatIds[3], // Shopping
  },
  {
    id: uuidv7(),
    payee: "Trader Joe's",
    type: "outgoing",
    amount: 6543,
    date: "2024-10-17",
    userId: userIds[0],
    accountId: accountIds[2],
    categoryId: user1CatIds[4], // Groceries
  },
  {
    id: uuidv7(),
    payee: "Lyft",
    type: "outgoing",
    amount: 2345,
    date: "2024-10-21",
    userId: userIds[0],
    accountId: accountIds[1],
    categoryId: user1CatIds[5], // Transportation
  },
  {
    id: uuidv7(),
    payee: "Airbnb",
    type: "outgoing",
    amount: 30000,
    date: "2024-10-23",
    userId: userIds[0],
    accountId: accountIds[2],
    categoryId: user1CatIds[6], // Travel
  },
  {
    id: uuidv7(),
    payee: "Chipotle",
    type: "outgoing",
    amount: 1500,
    date: "2024-10-26",
    userId: userIds[0],
    accountId: accountIds[1],
    categoryId: user1CatIds[1], // Dining out
  },
  {
    id: uuidv7(),
    payee: "Amazon",
    type: "outgoing",
    amount: 1234,
    date: "2024-10-29",
    userId: userIds[0],
    accountId: accountIds[2],
    categoryId: user1CatIds[3], // Shopping
  },
  {
    id: uuidv7(),
    payee: "Gas Station",
    type: "outgoing",
    amount: 5000,
    date: "2024-10-30",
    userId: userIds[0],
    accountId: accountIds[1],
    categoryId: user1CatIds[5], // Transportation
  },
  {
    id: uuidv7(),
    payee: "Panera Bread",
    type: "outgoing",
    amount: 2000,
    date: "2024-10-31",
    userId: userIds[0],
    accountId: accountIds[2],
    categoryId: user1CatIds[1], // Dining out
  },
  {
    id: uuidv7(),
    payee: "Starbucks",
    type: "outgoing",
    amount: 525,
    date: "2024-10-01",
    userId: userIds[0],
    accountId: accountIds[2],
    categoryId: user1CatIds[1], // Dining out
  },
  {
    id: uuidv7(),
    payee: "Gym Membership",
    type: "outgoing",
    amount: 9999,
    date: "2024-10-05",
    userId: userIds[0],
    accountId: accountIds[1],
    categoryId: user1CatIds[2], // Fitness
  },
  {
    id: uuidv7(),
    payee: "Amazon",
    type: "outgoing",
    amount: 2345,
    date: "2024-10-10",
    userId: userIds[0],
    accountId: accountIds[2],
    categoryId: user1CatIds[3], // Shopping
  },
  {
    id: uuidv7(),
    payee: "Kroger",
    type: "outgoing",
    amount: 12345,
    date: "2024-10-15",
    userId: userIds[0],
    accountId: accountIds[1],
    categoryId: user1CatIds[4], // Groceries
  },
  {
    id: uuidv7(),
    payee: "Uber",
    type: "outgoing",
    amount: 2500,
    date: "2024-10-20",
    userId: userIds[0],
    accountId: accountIds[2],
    categoryId: user1CatIds[5], // Transportation
  },
  {
    id: uuidv7(),
    payee: "Delta Airlines",
    type: "outgoing",
    amount: 50000,
    date: "2024-10-22",
    userId: userIds[0],
    accountId: accountIds[1],
    categoryId: user1CatIds[6], // Travel
  },
  {
    id: uuidv7(),
    payee: "Spotify",
    type: "outgoing",
    amount: 999,
    date: "2024-10-25",
    userId: userIds[0],
    accountId: accountIds[2],
    categoryId: user1CatIds[3], // Shopping
  },
  {
    id: uuidv7(),
    payee: "Whole Foods",
    type: "outgoing",
    amount: 8765,
    date: "2024-10-28",
    userId: userIds[0],
    accountId: accountIds[1],
    categoryId: user1CatIds[4], // Groceries
  },
  {
    id: uuidv7(),
    payee: "Lyft",
    type: "outgoing",
    amount: 3456,
    date: "2024-10-30",
    userId: userIds[0],
    accountId: accountIds[2],
    categoryId: user1CatIds[5], // Transportation
  },
  {
    id: uuidv7(),
    payee: "McDonald's",
    type: "outgoing",
    amount: 1234,
    date: "2024-10-31",
    userId: userIds[0],
    accountId: accountIds[1],
    categoryId: user1CatIds[1], // Dining out
  },

  {
    id: uuidv7(),
    payee: "Direct deposit",
    type: "incoming",
    amount: 351000,
    date: "2024-11-01",
    userId: userIds[0],
    accountId: accountIds[0],
    // categoryId: user1CatIds[0], // Incoming
  },
  {
    id: uuidv7(),
    payee: "Alo Yoga",
    type: "outgoing",
    amount: 12068,
    date: "2024-11-02",
    userId: userIds[0],
    accountId: accountIds[1],
    categoryId: user1CatIds[3], // Shopping
  },
  {
    id: uuidv7(),
    payee: "Lululemon",
    type: "outgoing",
    amount: 9532,
    date: "2024-11-02",
    userId: userIds[0],
    accountId: accountIds[1],
    categoryId: user1CatIds[3], // Shopping
  },
  {
    id: uuidv7(),
    payee: "Uber",
    type: "outgoing",
    amount: 1845,
    date: "2024-11-02",
    userId: userIds[0],
    accountId: accountIds[2],
    categoryId: user1CatIds[5], // Transportation
  },
  {
    id: uuidv7(),
    payee: "Blue Bottle Coffee",
    type: "outgoing",
    amount: 1535,
    date: "2024-11-02",
    userId: userIds[0],
    accountId: accountIds[1],
    categoryId: user1CatIds[1], // Dining Out
  },
  {
    id: uuidv7(),
    payee: "Sephora",
    type: "outgoing",
    amount: 15634,
    date: "2024-11-02",
    userId: userIds[0],
    accountId: accountIds[1],
    categoryId: user1CatIds[3], // Shopping
  },
  {
    id: uuidv7(),
    payee: "On Running",
    type: "outgoing",
    amount: 15547,
    date: "2024-11-07",
    userId: userIds[0],
    accountId: accountIds[1],
    categoryId: user1CatIds[3], // Shopping
  },
  {
    id: uuidv7(),
    payee: "Marta",
    type: "outgoing",
    amount: 18000,
    date: "2024-11-08",
    userId: userIds[0],
    accountId: accountIds[2],
    categoryId: user1CatIds[1], // Dining Out
  },
  {
    id: uuidv7(),
    payee: "Asiana Airlines",
    type: "outgoing",
    amount: 500000,
    date: "2024-11-10",
    userId: userIds[0],
    accountId: accountIds[2],
    categoryId: user1CatIds[6], // Travel
  },
  {
    id: uuidv7(),
    payee: "Shake Shack",
    type: "outgoing",
    amount: 1530,
    date: "2024-11-11",
    userId: userIds[0],
    accountId: accountIds[1],
    categoryId: user1CatIds[1], // Dining Out
  },
  {
    id: uuidv7(),
    payee: "Chanel",
    type: "outgoing",
    amount: 50087,
    date: "2024-11-12",
    userId: userIds[0],
    accountId: accountIds[1],
    categoryId: user1CatIds[3], // Shopping
  },
  {
    id: uuidv7(),
    payee: "Jungro KBBQ",
    type: "outgoing",
    amount: 35575,
    date: "2024-11-13",
    userId: userIds[0],
    accountId: accountIds[1],
    categoryId: user1CatIds[1], // Dining Out
  },
  {
    id: uuidv7(),
    payee: "Trader Joe's",
    type: "outgoing",
    amount: 8649,
    date: "2024-11-14",
    userId: userIds[0],
    accountId: accountIds[1],
    categoryId: user1CatIds[4], // Groceries
  },
  {
    id: uuidv7(),
    payee: "Direct deposit",
    type: "incoming",
    amount: 351029,
    date: "2024-11-15",
    userId: userIds[0],
    accountId: accountIds[0],
    // categoryId: user1CatIds[0], // Incoming
  },
  {
    id: uuidv7(),
    payee: "Glossier",
    type: "outgoing",
    amount: 2538,
    date: "2024-11-15",
    userId: userIds[0],
    accountId: accountIds[1],
    categoryId: user1CatIds[3], // Shopping
  },
  {
    id: uuidv7(),
    payee: "Uber",
    type: "outgoing",
    amount: 2487,
    date: "2024-11-16",
    userId: userIds[0],
    accountId: accountIds[1],
    categoryId: user1CatIds[5], // Transportation
  },
  {
    id: uuidv7(),
    payee: "Shake Shack",
    type: "outgoing",
    amount: 1536,
    date: "2024-11-17",
    userId: userIds[0],
    accountId: accountIds[1],
    categoryId: user1CatIds[1], // Dining Out
  },
  {
    id: uuidv7(),
    payee: "Okdongsik",
    type: "outgoing",
    amount: 7564,
    date: "2024-11-18",
    userId: userIds[0],
    accountId: accountIds[2],
    categoryId: user1CatIds[1], // Dining Out
  },
  {
    id: uuidv7(),
    payee: "H&M",
    type: "outgoing",
    amount: 3285,
    date: "2024-11-19",
    userId: userIds[0],
    accountId: accountIds[1],
    categoryId: user1CatIds[3], // Shopping
  },
  {
    id: uuidv7(),
    payee: "Equinox",
    type: "outgoing",
    amount: 30000,
    date: "2024-11-20",
    userId: userIds[0],
    accountId: accountIds[2],
    categoryId: user1CatIds[2], // Fitness
  },
  {
    id: uuidv7(),
    payee: "Masa",
    type: "outgoing",
    amount: 100000,
    date: "2024-11-21",
    userId: userIds[0],
    accountId: accountIds[1],
    categoryId: user1CatIds[1], // Dining Out
  },
  {
    id: uuidv7(),
    payee: "Lululemon",
    type: "outgoing",
    amount: 9555,
    date: "2024-11-23",
    userId: userIds[0],
    accountId: accountIds[1],
    categoryId: user1CatIds[3], // Shopping
  },
  {
    id: uuidv7(),
    payee: "Jungsik",
    type: "outgoing",
    amount: 12537,
    date: "2024-11-24",
    userId: userIds[0],
    accountId: accountIds[1],
    categoryId: user1CatIds[1], // Dining Out
  },
  {
    id: uuidv7(),
    payee: "Airbnb",
    type: "outgoing",
    amount: 183632,
    date: "2024-11-26",
    userId: userIds[0],
    accountId: accountIds[2],
    categoryId: user1CatIds[6], // Travel
  },
  {
    id: uuidv7(),
    payee: "Susan",
    type: "incoming",
    amount: 61201,
    date: "2024-11-26",
    userId: userIds[0],
    accountId: accountIds[2],
    categoryId: user1CatIds[6], // Travel
  },
  {
    id: uuidv7(),
    payee: "Jane",
    type: "incoming",
    amount: 61201,
    date: "2024-11-26",
    userId: userIds[0],
    accountId: accountIds[2],
    categoryId: user1CatIds[6], // Travel
  },
  {
    id: uuidv7(),
    payee: "BCD Tofu House",
    type: "outgoing",
    amount: 4574,
    date: "2024-11-27",
    userId: userIds[0],
    accountId: accountIds[1],
    categoryId: user1CatIds[1], // Dining Out
  },
  {
    id: uuidv7(),
    payee: "Chanel",
    type: "outgoing",
    amount: 55000,
    date: "2024-11-28",
    userId: userIds[0],
    accountId: accountIds[1],
    categoryId: user1CatIds[3], // Shopping
  },
  {
    id: uuidv7(),
    payee: "Uber",
    type: "outgoing",
    amount: 2536,
    date: "2024-11-29",
    userId: userIds[0],
    accountId: accountIds[2],
    categoryId: user1CatIds[5], // Transportation
  },
  {
    id: uuidv7(),
    payee: "Atomix",
    type: "outgoing",
    amount: 35363,
    date: "2024-11-30",
    userId: userIds[0],
    accountId: accountIds[1],
    categoryId: user1CatIds[1], // Dining Out
  },
]

export const transactions = [...user1Transactions]
