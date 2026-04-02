import { uuidv7 } from "uuidv7"
import { Prisma } from "@prisma/client"
import { nextMonth } from "./utilities"

export const makeCategoryMonths = (
  userId: string,
  categoryIds: string[],
  options: { startingMonth: string },
): Prisma.CategoryMonthCreateManyInput[] => {
  const month1 = options.startingMonth
  const month2 = nextMonth(options.startingMonth)

  return [
    {
      id: uuidv7(),
      userId: userId,
      categoryId: categoryIds[0], // Basics
      month: `${month1}`,
      amount: 400000,
    },
    {
      id: uuidv7(),
      userId: userId,
      categoryId: categoryIds[1], // Dining out
      month: `${month1}`,
      amount: 200000,
    },
    {
      id: uuidv7(),
      userId: userId,
      categoryId: categoryIds[2], // Fitness
      month: `${month1}`,
      amount: 40000,
    },
    {
      id: uuidv7(),
      userId: userId,
      categoryId: categoryIds[3], // Shopping
      month: `${month1}`,
      amount: 150000,
    },
    {
      id: uuidv7(),
      userId: userId,
      categoryId: categoryIds[4], // Groceries
      month: `${month1}`,
      amount: 25000,
    },
    {
      id: uuidv7(),
      userId: userId,
      categoryId: categoryIds[5], // Transportation
      month: `${month1}`,
      amount: 20000,
    },
    {
      id: uuidv7(),
      userId: userId,
      categoryId: categoryIds[6], // Travel
      month: `${month1}`,
      amount: 800000,
    },
    {
      id: uuidv7(),
      userId: userId,
      categoryId: categoryIds[0], // Basics
      month: `${month2}`,
      amount: 400000,
    },
    {
      id: uuidv7(),
      userId: userId,
      categoryId: categoryIds[1], // Dining out
      month: `${month2}`,
      amount: 200000,
    },
    {
      id: uuidv7(),
      userId: userId,
      categoryId: categoryIds[2], // Fitness
      month: `${month2}`,
      amount: 40000,
    },
    {
      id: uuidv7(),
      userId: userId,
      categoryId: categoryIds[3], // Shopping
      month: `${month2}`,
      amount: 150000,
    },
    {
      id: uuidv7(),
      userId: userId,
      categoryId: categoryIds[4], // Groceries
      month: `${month2}`,
      amount: 25000,
    },
    {
      id: uuidv7(),
      userId: userId,
      categoryId: categoryIds[5], // Transportation
      month: `${month2}`,
      amount: 20000,
    },
    {
      id: uuidv7(),
      userId: userId,
      categoryId: categoryIds[6], // Travel
      month: `${month2}`,
      amount: 800000,
    },
  ]
}
