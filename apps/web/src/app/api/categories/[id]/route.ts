import { NextResponse } from "next/server"
import type { ApiTypes } from "@balance/api-types"
import { apiError } from "@/server/errors"
import {
  monthParam,
  noContent,
  readJson,
  searchParam,
  withAuth,
} from "@/server/handler"
import {
  changeCategory,
  confirmC,
  deleteCategories,
  getCategoryForMonth,
} from "@/server/data"
import { isCategoryColor } from "@/theme/categoryColors"

export const runtime = "nodejs"

type Params = { id: string }

const notFound = (title: string) =>
  apiError(404, title, "Could not find category")

/** One category for ?startMonth= (old POST /category/retrieve/:id). */
export const GET = withAuth<Params>(async (request, { params, user }) => {
  const title = "Retrieve category"
  const month = monthParam(searchParam(request, "startMonth"), title)
  const category = await getCategoryForMonth(params.id, user.id, month)
  if (!category) throw notFound(title)
  const res: ApiTypes.Category.RetrieveResponse = category
  return NextResponse.json(res)
})

/**
 * Rename a category and/or set its amount for ?startMonth=
 * (old POST /category/change/:id).
 */
export const PATCH = withAuth<Params>(async (request, { params, user }) => {
  const title = "Change category"
  const { id } = params
  const month = monthParam(searchParam(request, "startMonth"), title)
  const { name, amount, color } =
    await readJson<Partial<ApiTypes.Category.ChangeRequest>>(request)
  if (amount !== undefined && !Number.isInteger(amount)) {
    throw apiError(400, title, "Must provide a valid amount (in cents)")
  }
  if (color !== undefined && !isCategoryColor(color)) {
    throw apiError(400, title, "Unknown colour")
  }
  await confirmC(id, user.id)

  const result = await changeCategory(
    { userId: user.id, id, month },
    { name, amount, color },
  )

  if (!result) throw notFound(title)
  const res: ApiTypes.Category.ChangeResponse = result
  return NextResponse.json(res)
})

/** Delete one category (old POST /category/remove). */
export const DELETE = withAuth<Params>(async (_request, { params, user }) => {
  const count = await deleteCategories(user.id, [params.id])
  if (!count) throw notFound("Delete category")
  return noContent()
})
