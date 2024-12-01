import { PayloadAction, createSelector } from "@reduxjs/toolkit"
import { createAppSlice } from "../app/createAppSlice"
import { ApiTypes } from "../types/api"
import { RootState } from "../app/store"

type Account = ApiTypes.Account.TSerialized
type ChangeResponse = { id: string; name: string; accountType: string }
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
    addPartialAccount(state, action: PayloadAction<ChangeResponse>) {
      const { id, name, accountType } = action.payload
      if (name) {
        state[id].name = name
      }
      if (accountType) {
        state[id].accountType = accountType
      }
    },
    removeManyAccounts(state, action: PayloadAction<string[]>) {
      const accountIds = action.payload
      for (const id of accountIds) {
        delete state[id]
      }
    },
  },

  selectors: {
    selectAccounts: state => state,
    selectAccountIds: state => Object.keys(state),
    selectAccountById: (state, id: string) => state[id],
  },
})

export const memoizedSelectAArr = createSelector(
  [(state: RootState) => state.accounts],
  state => Object.values(state),
)

// Action creators are generated for each case reducer function.
export const { addManyAccounts, addPartialAccount, removeManyAccounts } =
  accountsSlice.actions

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { selectAccounts, selectAccountIds, selectAccountById } =
  accountsSlice.selectors
