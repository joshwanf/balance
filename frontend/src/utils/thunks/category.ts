import { PayloadAction, createAsyncThunk } from "@reduxjs/toolkit"
import {
  addManyCategories,
  removeManyCategories,
} from "../../features/categoriesSlice"
import type { ApiTypes } from "../../types/api"
import { ApiError } from "../classes/ApiError"
import balance from "../api"

type ListSearchParams = ApiTypes.Category.ListSearchParams
type ListRes = ApiTypes.Category.ListResponse["categories"]

export const listCategoriesThunk = createAsyncThunk<
  ListRes,
  ListSearchParams,
  { rejectValue: ApiError }
>("getCategories", async (listOptions, thunkApi) => {
  const res = await balance.category.list(listOptions)
  if (res instanceof ApiError) {
    return thunkApi.rejectWithValue(res)
  }
  const { categories } = res
  /** Categories payload */
  const cPayload = categories

  /** Dispatch to reducers */
  thunkApi.dispatch(addManyCategories(cPayload))
  return cPayload
})

type CreateReq = {
  name: string
  amount: number
  month: string
}
type CreateRes = ApiTypes.Category.CreateResponse
export const createCategoriesThunk = createAsyncThunk<
  CreateRes,
  CreateReq,
  { rejectValue: ApiError }
>("createCategory", async (createOptions, thunkApi) => {
  const res = await balance.category.create(createOptions)
  if (res instanceof ApiError) {
    return thunkApi.rejectWithValue(res)
  }
  thunkApi.dispatch(addManyCategories([res]))
  return res
})

type AllChangeRequestFields = ApiTypes.Category.ChangeRequest
type ChangeThunkInputType = {
  id: string
  month: string
} & Partial<AllChangeRequestFields>
type ChangeResponse = ApiTypes.Category.ChangeResponse
export const changeCategoryThunk = createAsyncThunk<
  ChangeResponse,
  ChangeThunkInputType,
  { rejectValue: ApiError }
>("changeCategory", async (changedFields, thunkApi) => {
  const res = await balance.category.change(changedFields)
  if (res instanceof ApiError) {
    return thunkApi.rejectWithValue(res)
  }

  const cPayload = res

  /** Dispatch to reducers */
  thunkApi.dispatch(addManyCategories([res]))
  // if (cPayload) {
  //   thunkApi.dispatch(addCategoryFromTransaction(cPayload))
  // }
  return res
})

type RemoveReq = ApiTypes.Category.RemoveRequest
type RemoveRes = string[]
export const removeCategoriesThunk = createAsyncThunk<
  RemoveRes,
  RemoveReq,
  { rejectValue: ApiError }
>("createCategory", async (removeOptions, thunkApi) => {
  const res = await balance.category.remove(removeOptions)
  if (res instanceof ApiError) {
    return thunkApi.rejectWithValue(res)
  }
  thunkApi.dispatch(removeManyCategories(removeOptions.categoryIds))
  return removeOptions.categoryIds
})
