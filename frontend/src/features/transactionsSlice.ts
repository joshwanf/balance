import { PayloadAction } from "@reduxjs/toolkit"
import { createAppSlice } from "../app/createAppSlice"
import { ApiTypes } from "../types/api"
import { createSelector } from "reselect"
import type { RootState } from "../app/store"
import { createTransaction } from "../utils/thunks/transactions"
import { ApiError } from "../utils/classes/ApiError"
import dayjs from "dayjs"

type Transaction = ApiTypes.Transaction.TSerialized
interface TransactionsSliceState {
  error: null | Record<string, string>
  transactions: Record<string, Transaction>
  tags: string[]
}
const initialState: TransactionsSliceState = {
  error: null,
  transactions: {},
  tags: [],
}

export const transactionsSlice = createAppSlice({
  name: "transactions",
  initialState,
  reducers: {
    addOneT(state, action: PayloadAction<Transaction>) {
      const transaction = action.payload
      state.error = null
      state.transactions[transaction.id] = transaction
    },
    addManyTs(state, action: PayloadAction<Transaction[]>) {
      state.error = null
      state.transactions = {}
      const transactions = action.payload
      for (const t of transactions) {
        const mDate = dayjs(t.date, "YYYY-MM-DD")
        const fixedTDate = `${mDate.year()}-${mDate.month() + 1}-${mDate.format("DD")}`
        state.transactions[t.id] = { ...t, date: fixedTDate }
      }
    },
    removeT: (state, action: PayloadAction<string>) => {
      state.error = null
      delete state.transactions[action.payload]
    },
    addTagsList: (state, action: PayloadAction<string[]>) => {
      state.tags = action.payload
    },
    addTagsToT: (
      state,
      action: PayloadAction<{ id: string; tags: string[] }>,
    ) => {
      const { id, tags } = action.payload
      if (state.transactions[id]) {
        state.transactions[id].tags = [...state.transactions[id].tags, ...tags]
      }
    },
    removeTagsFromT: (
      state,
      action: PayloadAction<{ id: string; tags: string[] }>,
    ) => {
      const { id, tags } = action.payload
      if (state.transactions[id]) {
        const oldTags = state.transactions[id].tags
        state.transactions[id].tags = oldTags.filter(
          oldTag => !tags.includes(oldTag),
        )
      }
    },
  },
  extraReducers: builder => {
    builder.addCase(createTransaction.rejected, (state, action) => {
      const rejectedValue = action.payload
      if (rejectedValue instanceof ApiError) {
        const { err } = rejectedValue
        const errors = err.message as { msg: string; path: string }[]
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
    selectTags: state => state.tags,
  },
})

export const memoizedSelectTArr = createSelector(
  [(state: RootState) => state.transactions],
  transactions => {
    const asArray = Object.values(transactions.transactions)
    const sortedByDate = asArray.sort((a, b) => {
      if (a.date < b.date) {
        return 1
      } else if (a.date > b.date) {
        return -1
      } else {
        return a.id < b.id ? 1 : -1
      }
    })
    return sortedByDate
  },
)

// Action creators are generated for each case reducer function.
export const {
  addOneT,
  addManyTs,
  removeT,
  addTagsList,
  addTagsToT,
  removeTagsFromT,
} = transactionsSlice.actions

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { selectTransactions, selectTArr, selectTags } =
  transactionsSlice.selectors
