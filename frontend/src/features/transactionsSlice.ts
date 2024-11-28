import { PayloadAction, createAsyncThunk } from "@reduxjs/toolkit"
import { createAppSlice } from "../app/createAppSlice"
import { ApiTypes } from "../types/api"
import { createSelector } from "reselect"
import type { RootState } from "../app/store"
import moment from "moment"
import { createTransaction } from "../utils/thunks/transactions"
import { ApiError } from "../utils/classes/ApiError"

type Transaction = ApiTypes.Transaction.TSerialized
interface TransactionsSliceState {
  error: null | Record<string, string>
  transactions: Record<string, Transaction>
}
const initialState: TransactionsSliceState = {
  error: null,
  transactions: {},
}

export const transactionsSlice = createAppSlice({
  name: "transactions",
  initialState,
  reducers: {
    addManyTs(state, action: PayloadAction<Transaction[]>) {
      state.error = null
      const transactions = action.payload
      for (const t of transactions) {
        // console.log(t.date)
        const tDate = new Date(t.date)
        // const mDate = moment(t.date)
        const fixedTDate = `${tDate.getMonth() + 1}/${tDate.getDate()}/${tDate.getFullYear()}`
        state.transactions[t.id] = { ...t, date: fixedTDate }
      }
    },
    removeT: (state, action: PayloadAction<string>) => {
      state.error = null
      delete state.transactions[action.payload]
    },
  },
  extraReducers: builder => {
    builder.addCase(createTransaction.rejected, (state, action) => {
      const rejectedValue = action.payload
      if (rejectedValue instanceof ApiError) {
        const { err } = rejectedValue
        const errors = err.error as { msg: string; path: string }[]
        state.error = {}
        for (const e of errors) {
          state.error[e.path] = e.msg
        }
      }
    })
  },
  selectors: {
    selectTransactions: state => state.transactions,
    selectTArr: state => Object.values(state.transactions),
  },
})

export const memoizedSelectTArr = createSelector(
  [(state: RootState) => state.transactions],
  transactions => Object.values(transactions.transactions),
)

// Action creators are generated for each case reducer function.
export const { addManyTs, removeT } = transactionsSlice.actions

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { selectTransactions, selectTArr } = transactionsSlice.selectors
