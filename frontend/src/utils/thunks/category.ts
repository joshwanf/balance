import { PayloadAction, createAsyncThunk } from "@reduxjs/toolkit"
import { addManyCategories } from "../../features/categoriesSlice"
import type { ApiTypes } from "../../types/api"
import { ApiError } from "../classes/ApiError"
import balance from "../api"

type ListRes = ApiTypes.Category.ListResponse["categories"]

export const listCategoriesThunk = createAsyncThunk<
  ListRes,
  void,
  { rejectValue: ApiError }
>("getCategories", async (_, thunkApi) => {
  const res = await balance.category.list()
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
