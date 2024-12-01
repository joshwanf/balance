import { PayloadAction, createSelector } from "@reduxjs/toolkit"
import { createAppSlice } from "../app/createAppSlice"
import { ApiTypes } from "../types/api"
import { RootState } from "../app/store"

type Account = ApiTypes.Account.TSerialized
type ChangeResponse = { id: string; name: string; accountType?: string }
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
    addPartialAccounts(state, action: PayloadAction<ChangeResponse[]>) {
      const partialAccounts = action.payload
      for (const p of partialAccounts) {
        const { id, name, accountType } = p
        const recordExists = Object.keys(state).includes(id)
        if (recordExists) {
          if (name) {
            state[id].name = name
          }
          if (accountType) {
            state[id].accountType = accountType
          }
        } else {
          state[id] = {
            id: p.id,
            name: p.name,
            accountType: p.accountType || "standard account",
            usedAmount: 0,
          }
        }
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
export const { addManyAccounts, addPartialAccounts, removeManyAccounts } =
  accountsSlice.actions

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { selectAccounts, selectAccountIds, selectAccountById } =
  accountsSlice.selectors
