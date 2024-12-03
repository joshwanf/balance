import { PayloadAction, createAsyncThunk } from "@reduxjs/toolkit"
import { addManyTs, addOneT } from "../../features/transactionsSlice"
import {
  addCategoryFromTransaction,
  addManyCategories,
  addManyCategoriesFromTransaction,
  addManyPartialCategories,
} from "../../features/categoriesSlice"
import type { ApiTypes } from "../../types/api"
import { ApiError } from "../classes/ApiError"
import balance from "../api"

type TList = ApiTypes.Transaction.ListResponse["transactions"]
type ListSearchParams = ApiTypes.Transaction.ListSearchParams
export const listTransactionsThunk = createAsyncThunk<TList, ListSearchParams>(
  "getTransactions",
  async (listOptions, thunkApi) => {
    const res = await balance.transaction.list(listOptions)
    if (res instanceof ApiError) {
      return thunkApi.rejectWithValue(res)
    }
    const { transactions, categories } = res

    /** Categories and Transactions payload */
    const tPayload = transactions

    /** Dispatch to reducers */
    thunkApi.dispatch(addManyTs(tPayload))
    // if (categories.length > 0) {
    thunkApi.dispatch(addManyCategories(categories))
    // }
    return tPayload
  },
)

type CreateRequest = ApiTypes.Transaction.CreateRequest
type CreateThunkReturn = ApiTypes.Transaction.CreateResponse
export const createTransaction = createAsyncThunk<
  CreateThunkReturn,
  CreateRequest,
  { rejectValue: ApiError }
>("createTransaction", async (createInput, thunkApi) => {
  try {
    const res = await balance.transaction.create(createInput)
    console.log("--", res)
    if (res instanceof ApiError) {
      return thunkApi.rejectWithValue(res)
    }
    thunkApi.dispatch(addOneT(res))
    return res
  } catch (e) {
    if (e instanceof ApiError) {
      return thunkApi.rejectWithValue(e)
    } else {
      return thunkApi.rejectWithValue(
        new ApiError({ title: "unknown error", status: 400, message: e }, 400),
      )
    }
  }
})

type AllChangeRequestFields = ApiTypes.Transaction.ChangeRequest
type ChangeThunkInputType = { id: string } & Partial<AllChangeRequestFields>
type ChangeResponse = ApiTypes.Transaction.ChangeResponse
export const changeTransactionThunk = createAsyncThunk<
  ChangeResponse,
  ChangeThunkInputType,
  { rejectValue: ApiError }
>("changeTransaction", async (changedFields, thunkApi) => {
  const res = await balance.transaction.change(changedFields)
  if (res instanceof ApiError) {
    return thunkApi.rejectWithValue(res)
  }

  /** Category, account, and Transaction payload */
  // const { category, account, ...transaction } = res
  // const cPayload = res.category
  // const aPayload = res.account
  const tPayload = res

  /** Dispatch to reducers */
  thunkApi.dispatch(addOneT(res))
  // if (cPayload) {
  //   thunkApi.dispatch(addCategoryFromTransaction(cPayload))
  // }
  return res
})
