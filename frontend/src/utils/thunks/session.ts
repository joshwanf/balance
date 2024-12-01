import { createAsyncThunk } from "@reduxjs/toolkit"
import { ApiTypes } from "../../types/api"
import { login } from "../../features/sessionSlice"
import balance from "../api"
import { ApiError } from "../classes/ApiError"
import { addManyPartialCategories } from "../../features/categoriesSlice"
import {
  addManyAccounts,
  addPartialAccounts,
} from "../../features/accountsSlice"

type SafeUser = ApiTypes.Session.SafeUser
type LoginDetails = ApiTypes.Session.LoginRequest
type SessionInfo = ApiTypes.Session.LoginResponse

export const loginThunk = createAsyncThunk<
  SafeUser,
  LoginDetails,
  { rejectValue: ApiError }
>("loginUser", async (loginDetails, thunkApi) => {
  const res = await balance.session.login(loginDetails)

  if (res instanceof ApiError) {
    return thunkApi.rejectWithValue(res)
  }
  const {
    success: {
      user: { accounts, categories, ...safeUser },
    },
  } = res
  thunkApi.dispatch(login(safeUser))
  thunkApi.dispatch(addManyPartialCategories(categories))
  thunkApi.dispatch(addPartialAccounts(accounts))
  return safeUser
})

export const loginDemoThunk = createAsyncThunk<
  SafeUser,
  void,
  { rejectValue: ApiError }
>("loginDemoUser", async (_, thunkApi) => {
  const res = await balance.session.loginDemoUser()

  if (res instanceof ApiError) {
    return thunkApi.rejectWithValue(res)
  }
  const {
    success: {
      user: { accounts, categories, ...safeUser },
    },
  } = res
  thunkApi.dispatch(login(safeUser))
  thunkApi.dispatch(addManyPartialCategories(categories))
  thunkApi.dispatch(addPartialAccounts(accounts))
  return safeUser
})

export const restoreSession = createAsyncThunk<
  SafeUser,
  void,
  { rejectValue: ApiError }
>("restoreSession", async (_, thunkApi) => {
  const res = await balance.session.restore()
  if (res instanceof ApiError) {
    return thunkApi.rejectWithValue(res)
  }
  const {
    success: {
      user: { accounts, categories, ...safeUser },
    },
  } = res
  thunkApi.dispatch(login(safeUser))
  thunkApi.dispatch(addManyPartialCategories(categories))
  thunkApi.dispatch(addPartialAccounts(accounts))
  return safeUser
})
