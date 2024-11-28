import { PayloadAction, createSelector } from "@reduxjs/toolkit"
import { createAppSlice } from "../app/createAppSlice"
import { ApiTypes } from "../types/api"
import { RootState } from "../app/store"

type Account = Omit<ApiTypes.Account.Account, "cleanedName">
export type AccountSliceState = Record<string, Account>

const initialState: AccountSliceState = {}

export const accountsSlice = createAppSlice({
  name: "accounts",
  initialState,
  reducers: {
    addManyAccounts(state, action: PayloadAction<Account[]>) {
      const accounts = action.payload
      for (const a of accounts) {
        state[a.id] = a
      }
    },
  },

  selectors: {
    selectAccounts: state => state,
    selectAccountById: (state, id: string) => state[id],
  },
})

export const memoizedSelectAArr = createSelector(
  [(state: RootState) => state.accounts],
  state => Object.values(state),
)

// Action creators are generated for each case reducer function.
export const { addManyAccounts } = accountsSlice.actions

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { selectAccounts, selectAccountById } = accountsSlice.selectors
