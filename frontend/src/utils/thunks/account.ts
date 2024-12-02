import { createAsyncThunk } from "@reduxjs/toolkit"
import type { ApiTypes } from "../../types/api"
import { ApiError } from "../classes/ApiError"
import balance from "../api"
import {
  addManyAccounts,
  addPartialAccounts,
  removeManyAccounts,
} from "../../features/accountsSlice"

type ListRes = ApiTypes.Account.ListRequest
type ListSearchParams = ApiTypes.Account.ListSearchParams
export const listAccountsThunk = createAsyncThunk<ListRes, ListSearchParams>(
  "getAccounts",
  async (listOptions, thunkApi) => {
    const res = await balance.account.list(listOptions)
    if (res instanceof ApiError) {
      return thunkApi.rejectWithValue(res)
    }
    const { accounts } = res

    /** Dispatch to reducers */
    thunkApi.dispatch(addManyAccounts(accounts))
    return accounts
  },
)

type CreateRequest = ApiTypes.Account.CreateRequest
type CreateThunkReturn = ApiTypes.Account.CreateResponse
export const createAccountThunk = createAsyncThunk<
  CreateThunkReturn,
  CreateRequest,
  { rejectValue: ApiError }
>("createAccount", async (createInput, thunkApi) => {
  const res = await balance.account.create(createInput)
  if (res instanceof ApiError) {
    return thunkApi.rejectWithValue(res)
  }
  const { accounts } = res
  thunkApi.dispatch(addManyAccounts(accounts))
  return res
})

type AllChangeRequestFields = ApiTypes.Account.ChangeRequest
type ChangeThunkInputType = { id: string } & Partial<AllChangeRequestFields>
type ChangeResponse = ApiTypes.Account.ChangeResponse
export const changeAccountThunk = createAsyncThunk<
  ChangeResponse,
  ChangeThunkInputType,
  { rejectValue: ApiError }
>("changeAccount", async (changedFields, thunkApi) => {
  const res = await balance.account.change(changedFields)
  if (res instanceof ApiError) {
    return thunkApi.rejectWithValue(res)
  }

  thunkApi.dispatch(addPartialAccounts([res]))
  return res
})

type RemoveRequest = ApiTypes.Account.RemoveRequest
type RemoveResponse = ApiTypes.Account.RemoveResponse
export const removeAccountThunk = createAsyncThunk<
  RemoveResponse,
  RemoveRequest,
  { rejectValue: ApiError }
>("removeAccount", async (removeInput, thunkApi) => {
  const res = await balance.account.remove(removeInput.accountIds)
  if (res instanceof ApiError) {
    return thunkApi.rejectWithValue(res)
  }

  thunkApi.dispatch(removeManyAccounts(removeInput.accountIds))
  return res
})
