import type { Action, PayloadAction } from "@reduxjs/toolkit"
import { createAppSlice } from "../app/createAppSlice"
import { ApiTypes } from "../types/api"
import { loginThunk } from "../utils/thunks/session"
import moment from "moment"

type SafeUser = ApiTypes.Session.SafeUser
type LoginResponse = ApiTypes.Session.LoginResponse

export interface SessionSliceState {
  user: SafeUser | null
  status: "idle" | "loading" | "failed" | "logged out" | "logged in"
  error: Record<string, any> | null
  settings: { curMonth: string }
}

const initialState: SessionSliceState = {
  user: null,
  status: "idle",
  error: null,
  settings: { curMonth: moment().format("YYYY-MM") },
}

// const isLogInAction = (action: Action): action is PayloadAction<SafeUser> => {
//   const [slice, actionName, status] = action.type.split("/")
//   return (
//     ["loginThunk", "loginAsync"].includes(actionName) && status === "fulfilled"
//   )
// }

export const sessionSlice = createAppSlice({
  name: "session",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<SafeUser>) => {
      state.user = action.payload
    },
    logout: state => {
      state.user = null
    },
    setCurMonth: (state, action: PayloadAction<string>) => {
      state.settings.curMonth = action.payload
    },
  },
  // extraReducers: builder => {
  //   builder.addMatcher(isLogInAction, (state, action) => {
  //     state.user = action.payload
  //     state.error = null
  //   })
  // },
  selectors: {
    selectSession: session => session,
    selectUser: session => session.user,
  },
})

export const { login, logout, setCurMonth } = sessionSlice.actions

export const { selectSession, selectUser } = sessionSlice.selectors
