import type { Action, PayloadAction } from "@reduxjs/toolkit"
import { createAppSlice } from "../store/createAppSlice"
import type { ApiTypes } from "@balance/api-types"

type SafeUser = ApiTypes.Session.SafeUser
type LoginResponse = ApiTypes.Session.LoginResponse

export interface SessionSliceState {
  user: SafeUser | null
  status: "idle" | "loading" | "failed" | "logged out" | "logged in"
  error: Record<string, any> | null
}

const initialState: SessionSliceState = {
  user: null,
  status: "idle",
  error: null,
}

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

export const { login, logout } = sessionSlice.actions

export const { selectSession, selectUser } = sessionSlice.selectors
