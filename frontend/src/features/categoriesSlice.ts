import {
  PayloadAction,
  Action,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit"
import { createAppSlice } from "../app/createAppSlice"
import { ApiTypes } from "../types/api"
import { RootState } from "../app/store"

type Category = ApiTypes.Category.TSerialized
type CategoryFromLogin = { id: string; name: string }
// type PartialCategory = { id: string; name: string } & Partial<Category>
export type CategorySliceState = Record<string, Category>

const initialState: CategorySliceState = {}

export const categoriesSlice = createAppSlice({
  name: "categories",
  initialState,
  reducers: {
    addManyPartialCategories(
      state,
      action: PayloadAction<CategoryFromLogin[]>,
    ) {
      const categories = action.payload
      for (const c of categories) {
        state[c.id] = { ...c, amount: 0, usedAmount: 0 }
      }
    },
    addCategoryFromTransaction(
      state,
      action: PayloadAction<Omit<Category, "userId">>,
    ) {
      const category = action.payload
      state[category.id] = { ...state[category.id], ...category }
    },
    addManyCategoriesFromTransaction(
      state,
      action: PayloadAction<
        Omit<Category, "userId" | "amount" | "usedAmount">[]
      >,
    ) {
      const categories = action.payload
      for (const category of categories) {
        state[category.id] = { ...state[category.id], ...category }
      }
    },
    addManyCategories(state, action: PayloadAction<Category[]>) {
      const categories = action.payload
      // console.log(categories)
      for (const category of categories) {
        if (category) {
          state[category.id] = category
        }
      }
    },
  },

  selectors: {
    selectCategories: state => state,
    selectCategoryById: (state, id: string) => state[id],
  },
})

export const memoizedSelectCArr = createSelector(
  [(state: RootState) => state.categories],
  state => Object.values(state),
)

// Action creators are generated for each case reducer function.
export const {
  addManyPartialCategories,
  addCategoryFromTransaction,
  addManyCategoriesFromTransaction,
  addManyCategories,
} = categoriesSlice.actions

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { selectCategories, selectCategoryById } =
  categoriesSlice.selectors
