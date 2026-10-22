import { uuidv7 } from "uuidv7"
import { Prisma } from "@prisma/client"
import { nextMonth } from "./utilities"

export const makeTransactions = (
  userId: string,
  accountIds: string[],
  categoryIds: string[],
  options: { startingMonth: string },
): Prisma.TransactionCreateManyInput[] => {
  const month1 = options.startingMonth
  const month2 = nextMonth(options.startingMonth)

  return [
    {
      id: uuidv7(),
      payee: "Netflix",
      type: "outgoing",
      amount: 1500,
      date: `${month1}-03`,
      userId: userId,
      accountId: accountIds[1],
      categoryId: categoryIds[3], // Shopping
    },
    {
      id: uuidv7(),
      payee: "Peloton",
      type: "outgoing",
      amount: 3999,
      date: `${month1}-07`,
      userId: userId,
      accountId: accountIds[2],
      categoryId: categoryIds[2], // Fitness
    },
    {
      id: uuidv7(),
      payee: "Target",
      type: "outgoing",
      amount: 7890,
      date: `${month1}-12`,
      userId: userId,
      accountId: accountIds[1],
      categoryId: categoryIds[3], // Shopping
    },
    {
      id: uuidv7(),
      payee: "Trader Joe's",
      type: "outgoing",
      amount: 6543,
      date: `${month1}-17`,
      userId: userId,
      accountId: accountIds[2],
      categoryId: categoryIds[4], // Groceries
    },
    {
      id: uuidv7(),
      payee: "Lyft",
      type: "outgoing",
      amount: 2345,
      date: `${month1}-21`,
      userId: userId,
      accountId: accountIds[1],
      categoryId: categoryIds[5], // Transportation
    },
    {
      id: uuidv7(),
      payee: "Airbnb",
      type: "outgoing",
      amount: 30000,
      date: `${month1}-23`,
      userId: userId,
      accountId: accountIds[2],
      categoryId: categoryIds[6], // Travel
    },
    {
      id: uuidv7(),
      payee: "Chipotle",
      type: "outgoing",
      amount: 1500,
      date: `${month1}-26`,
      userId: userId,
      accountId: accountIds[1],
      categoryId: categoryIds[1], // Dining out
    },
    {
      id: uuidv7(),
      payee: "Amazon",
      type: "outgoing",
      amount: 1234,
      date: `${month1}-29`,
      userId: userId,
      accountId: accountIds[2],
      categoryId: categoryIds[3], // Shopping
    },
    {
      id: uuidv7(),
      payee: "Gas Station",
      type: "outgoing",
      amount: 5000,
      date: `${month1}-30`,
      userId: userId,
      accountId: accountIds[1],
      categoryId: categoryIds[5], // Transportation
    },
    {
      id: uuidv7(),
      payee: "Panera Bread",
      type: "outgoing",
      amount: 2000,
      date: `${month1}-31`,
      userId: userId,
      accountId: accountIds[2],
      categoryId: categoryIds[1], // Dining out
    },
    {
      id: uuidv7(),
      payee: "Starbucks",
      type: "outgoing",
      amount: 525,
      date: `${month1}-01`,
      userId: userId,
      accountId: accountIds[2],
      categoryId: categoryIds[1], // Dining out
    },
    {
      id: uuidv7(),
      payee: "Gym Membership",
      type: "outgoing",
      amount: 9999,
      date: `${month1}-05`,
      userId: userId,
      accountId: accountIds[1],
      categoryId: categoryIds[2], // Fitness
    },
    {
      id: uuidv7(),
      payee: "Amazon",
      type: "outgoing",
      amount: 2345,
      date: `${month1}-10`,
      userId: userId,
      accountId: accountIds[2],
      categoryId: categoryIds[3], // Shopping
    },
    {
      id: uuidv7(),
      payee: "Kroger",
      type: "outgoing",
      amount: 12345,
      date: `${month1}-15`,
      userId: userId,
      accountId: accountIds[1],
      categoryId: categoryIds[4], // Groceries
    },
    {
      id: uuidv7(),
      payee: "Uber",
      type: "outgoing",
      amount: 2500,
      date: `${month1}-20`,
      userId: userId,
      accountId: accountIds[2],
      categoryId: categoryIds[5], // Transportation
    },
    {
      id: uuidv7(),
      payee: "Delta Airlines",
      type: "outgoing",
      amount: 50000,
      date: `${month1}-22`,
      userId: userId,
      accountId: accountIds[1],
      categoryId: categoryIds[6], // Travel
    },
    {
      id: uuidv7(),
      payee: "Spotify",
      type: "outgoing",
      amount: 999,
      date: `${month1}-25`,
      userId: userId,
      accountId: accountIds[2],
      categoryId: categoryIds[3], // Shopping
    },
    {
      id: uuidv7(),
      payee: "Whole Foods",
      type: "outgoing",
      amount: 8765,
      date: `${month1}-28`,
      userId: userId,
      accountId: accountIds[1],
      categoryId: categoryIds[4], // Groceries
    },
    {
      id: uuidv7(),
      payee: "Lyft",
      type: "outgoing",
      amount: 3456,
      date: `${month1}-30`,
      userId: userId,
      accountId: accountIds[2],
      categoryId: categoryIds[5], // Transportation
    },
    {
      id: uuidv7(),
      payee: "McDonald's",
      type: "outgoing",
      amount: 1234,
      date: `${month1}-31`,
      userId: userId,
      accountId: accountIds[1],
      categoryId: categoryIds[1], // Dining out
    },

    {
      id: uuidv7(),
      payee: "Direct deposit",
      type: "incoming",
      amount: 351000,
      date: `${month2}-01`,
      userId: userId,
      accountId: accountIds[0],
      categoryId: categoryIds[0], // Incoming
    },
    {
      id: uuidv7(),
      payee: "Alo Yoga",
      type: "outgoing",
      amount: 12068,
      date: `${month2}-02`,
      userId: userId,
      accountId: accountIds[1],
      categoryId: categoryIds[3], // Shopping
    },
    {
      id: uuidv7(),
      payee: "Lululemon",
      type: "outgoing",
      amount: 9532,
      date: `${month2}-02`,
      userId: userId,
      accountId: accountIds[1],
      categoryId: categoryIds[3], // Shopping
    },
    {
      id: uuidv7(),
      payee: "Uber",
      type: "outgoing",
      amount: 1845,
      date: `${month2}-02`,
      userId: userId,
      accountId: accountIds[2],
      categoryId: categoryIds[5], // Transportation
    },
    {
      id: uuidv7(),
      payee: "Blue Bottle Coffee",
      type: "outgoing",
      amount: 1535,
      date: `${month2}-02`,
      userId: userId,
      accountId: accountIds[1],
      categoryId: categoryIds[1], // Dining Out
    },
    {
      id: uuidv7(),
      payee: "Sephora",
      type: "outgoing",
      amount: 15634,
      date: `${month2}-02`,
      userId: userId,
      accountId: accountIds[1],
      categoryId: categoryIds[3], // Shopping
    },
    {
      id: uuidv7(),
      payee: "On Running",
      type: "outgoing",
      amount: 15547,
      date: `${month2}-07`,
      userId: userId,
      accountId: accountIds[1],
      categoryId: categoryIds[3], // Shopping
    },
    {
      id: uuidv7(),
      payee: "Marta",
      type: "outgoing",
      amount: 18000,
      date: `${month2}-08`,
      userId: userId,
      accountId: accountIds[2],
      categoryId: categoryIds[1], // Dining Out
    },
    {
      id: uuidv7(),
      payee: "Asiana Airlines",
      type: "outgoing",
      amount: 500000,
      date: `${month2}-10`,
      userId: userId,
      accountId: accountIds[2],
      categoryId: categoryIds[6], // Travel
    },
    {
      id: uuidv7(),
      payee: "Shake Shack",
      type: "outgoing",
      amount: 1530,
      date: `${month2}-11`,
      userId: userId,
      accountId: accountIds[1],
      categoryId: categoryIds[1], // Dining Out
    },
    {
      id: uuidv7(),
      payee: "Chanel",
      type: "outgoing",
      amount: 50087,
      date: `${month2}-12`,
      userId: userId,
      accountId: accountIds[1],
      categoryId: categoryIds[3], // Shopping
    },
    {
      id: uuidv7(),
      payee: "Jungro KBBQ",
      type: "outgoing",
      amount: 35575,
      date: `${month2}-13`,
      userId: userId,
      accountId: accountIds[1],
      categoryId: categoryIds[1], // Dining Out
    },
    {
      id: uuidv7(),
      payee: "Trader Joe's",
      type: "outgoing",
      amount: 8649,
      date: `${month2}-14`,
      userId: userId,
      accountId: accountIds[1],
      categoryId: categoryIds[4], // Groceries
    },
    {
      id: uuidv7(),
      payee: "Direct deposit",
      type: "incoming",
      amount: 351029,
      date: `${month2}-15`,
      userId: userId,
      accountId: accountIds[0],
      // categoryId: categoryIds[0], // Incoming
    },
    {
      id: uuidv7(),
      payee: "Glossier",
      type: "outgoing",
      amount: 2538,
      date: `${month2}-15`,
      userId: userId,
      accountId: accountIds[1],
      categoryId: categoryIds[3], // Shopping
    },
    {
      id: uuidv7(),
      payee: "Uber",
      type: "outgoing",
      amount: 2487,
      date: `${month2}-16`,
      userId: userId,
      accountId: accountIds[1],
      categoryId: categoryIds[5], // Transportation
    },
    {
      id: uuidv7(),
      payee: "Shake Shack",
      type: "outgoing",
      amount: 1536,
      date: `${month2}-17`,
      userId: userId,
      accountId: accountIds[1],
      categoryId: categoryIds[1], // Dining Out
    },
    {
      id: uuidv7(),
      payee: "Okdongsik",
      type: "outgoing",
      amount: 7564,
      date: `${month2}-18`,
      userId: userId,
      accountId: accountIds[2],
      categoryId: categoryIds[1], // Dining Out
    },
    {
      id: uuidv7(),
      payee: "H&M",
      type: "outgoing",
      amount: 3285,
      date: `${month2}-19`,
      userId: userId,
      accountId: accountIds[1],
      categoryId: categoryIds[3], // Shopping
    },
    {
      id: uuidv7(),
      payee: "Equinox",
      type: "outgoing",
      amount: 30000,
      date: `${month2}-20`,
      userId: userId,
      accountId: accountIds[2],
      categoryId: categoryIds[2], // Fitness
    },
    {
      id: uuidv7(),
      payee: "Masa",
      type: "outgoing",
      amount: 100000,
      date: `${month2}-21`,
      userId: userId,
      accountId: accountIds[1],
      categoryId: categoryIds[1], // Dining Out
    },
    {
      id: uuidv7(),
      payee: "Lululemon",
      type: "outgoing",
      amount: 9555,
      date: `${month2}-23`,
      userId: userId,
      accountId: accountIds[1],
      categoryId: categoryIds[3], // Shopping
    },
    {
      id: uuidv7(),
      payee: "Jungsik",
      type: "outgoing",
      amount: 12537,
      date: `${month2}-24`,
      userId: userId,
      accountId: accountIds[1],
      categoryId: categoryIds[1], // Dining Out
    },
    {
      id: uuidv7(),
      payee: "Airbnb",
      type: "outgoing",
      amount: 183632,
      date: `${month2}-26`,
      userId: userId,
      accountId: accountIds[2],
      categoryId: categoryIds[6], // Travel
    },
    {
      id: uuidv7(),
      payee: "Susan",
      type: "incoming",
      amount: 61201,
      date: `${month2}-26`,
      userId: userId,
      accountId: accountIds[2],
      categoryId: categoryIds[6], // Travel
    },
    {
      id: uuidv7(),
      payee: "Jane",
      type: "incoming",
      amount: 61201,
      date: `${month2}-26`,
      userId: userId,
      accountId: accountIds[2],
      categoryId: categoryIds[6], // Travel
    },
    {
      id: uuidv7(),
      payee: "BCD Tofu House",
      type: "outgoing",
      amount: 4574,
      date: `${month2}-27`,
      userId: userId,
      accountId: accountIds[1],
      categoryId: categoryIds[1], // Dining Out
    },
    {
      id: uuidv7(),
      payee: "Chanel",
      type: "outgoing",
      amount: 55000,
      date: `${month2}-28`,
      userId: userId,
      accountId: accountIds[1],
      categoryId: categoryIds[3], // Shopping
    },
    {
      id: uuidv7(),
      payee: "Uber",
      type: "outgoing",
      amount: 2536,
      date: `${month2}-29`,
      userId: userId,
      accountId: accountIds[2],
      categoryId: categoryIds[5], // Transportation
    },
    {
      id: uuidv7(),
      payee: "Atomix",
      type: "outgoing",
      amount: 35363,
      date: `${month2}-30`,
      userId: userId,
      accountId: accountIds[1],
      categoryId: categoryIds[1], // Dining Out
    },
  ]
}
