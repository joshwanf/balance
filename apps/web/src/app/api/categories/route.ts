import { NextResponse } from "next/server"
import { uuidv7 } from "uuidv7"
import type { ApiTypes } from "@balance/api-types"
import { pc } from "@/server/prisma"
import { apiError } from "@/server/errors"
import {
  listParam,
  noContent,
  readJson,
  searchParam,
  withAuth,
} from "@/server/handler"
import {
  checkValidCategoryName,
  getCategoriesWithTransAgg,
  monthParam,
} from "@/server/queries"

export const runtime = "nodejs"

/** List categories for one month (old POST /category/list). */
export const GET = withAuth(async (request, { user }) => {
  const startMonth = monthParam(
    searchParam(request, "startMonth"),
    "List categories"
  )
  const categories = await getCategoriesWithTransAgg(user.id, startMonth)
  const res: ApiTypes.Category.ListResponse = { categories }
  return NextResponse.json(res)
})

/**
 * Create one Category and its CategoryMonth for ?startMonth=
 * (old POST /category/create).
 */
export const POST = withAuth(async (request, { user }) => {
  const title = "Create category"
  const startMonth = monthParam(searchParam(request, "startMonth"), title)
  const { name, amount = 0 } =
    await readJson<ApiTypes.Category.CreateRequest>(request)
  if (!name) throw apiError(400, title, "Include a category name")
  if (!Number.isInteger(amount)) {
    throw apiError(400, title, "Amount must be in cents")
  }
  const cleanedName = await checkValidCategoryName(name, user.id)

  const created = await pc.category.create({
    include: { CategoryMonth: true },
    data: {
      id: uuidv7(),
      userId: user.id,
      name,
      cleanedName,
      CategoryMonth: {
        create: [{ id: uuidv7(), amount, month: startMonth, userId: user.id }],
      },
    },
  })
  const res: ApiTypes.Category.CreateResponse = {
    id: created.id,
    name: created.name,
    month: startMonth,
    amount: created.CategoryMonth[0].amount,
    usedAmount: 0,
  }
  return NextResponse.json(res, { status: 201 })
})

/** Delete several categories: DELETE /api/categories?ids=a,b */
export const DELETE = withAuth(async (request, { user }) => {
  const ids = listParam(request, "ids")
  if (!ids.length) {
    throw apiError(400, "Delete categories", "Include ?ids=")
  }
  // Scoped to the user: the old route deleted any user's categories by id.
  await pc.category.deleteMany({ where: { id: { in: ids }, userId: user.id } })
  return noContent()
})
