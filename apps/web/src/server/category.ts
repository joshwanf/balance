import "server-only"
import { Prisma } from "@prisma/client"
import { pc } from "@/server/prisma"
import { apiError } from "@/server/errors"
import {
  checkValidCategoryName,
  confirmC,
  getCategoryForMonth,
} from "@/server/queries"
import { cleanName } from "@/server/utils/cleanName"
import { ApiTypes } from "@balance/api-types"
import { uuidv7 } from "uuidv7"

export const listCategoryNames = async (userId: string) => {
  const categories = await pc.category.findMany({
    where: { userId },
    select: { id: true, name: true },
  })
  return categories
}

export const createCategory = async (
  userId: string,
  { name, amount, month }: { name: string; amount: number; month: string },
) => {
  const cleanedName = await checkValidCategoryName(name, userId)

  const created = await pc.category
    .create({
      include: { CategoryMonth: true },
      data: {
        id: uuidv7(),
        userId,
        name,
        cleanedName,
        CategoryMonth: {
          create: [{ id: uuidv7(), amount, month, userId }],
        },
      },
    })
    .catch(e => {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2002"
      ) {
        throw apiError(
          400,
          "Couldn't create budget",
          "Category with that name already exists",
        )
      }
      throw e
    })

  return {
    id: created.id,
    name: created.name,
    month,
    amount: created.CategoryMonth[0].amount,
    usedAmount: 0,
  }
}

type ChangeCategoryRequest = Partial<ApiTypes.Category.ChangeRequest>
type ChangeCategoryResult = ApiTypes.Category.ChangeResponse

export const changeCategory = async (
  { userId, id, month }: { userId: string; id: string; month: string },
  { name, amount }: ChangeCategoryRequest,
): Promise<ChangeCategoryResult | null> => {
  await confirmC(id, userId)

  const result = await pc.$transaction(async prisma => {
    if (name) {
      await prisma.category.update({
        where: { id, userId },
        data: { name, cleanedName: cleanName(name) },
      })
    }
    await prisma.categoryMonth.upsert({
      where: {
        userId_categoryId_month: { userId, categoryId: id, month },
      },
      update: amount !== undefined ? { amount } : {},
      create: {
        id: uuidv7(),
        userId,
        categoryId: id,
        amount: amount ?? 0,
        month,
      },
    })
    return getCategoryForMonth(id, userId, month, prisma)
  })

  return result
}

export const deleteCategories = async (
  userId: string,
  categoryIds: string[],
) => {
  const { count } = await pc.category.deleteMany({
    where: { id: { in: categoryIds }, userId },
  })

  return count
}
