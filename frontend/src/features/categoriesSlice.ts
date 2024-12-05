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
// type CategoryFromLogin = { id: string; name: string; month: string }
type CategoryFromLogin =
  ApiTypes.Session.LoginResponse["success"]["user"]["categories"]
export type PartialCategory = {
  id: string
  name: string
  month: string
  amount?: number
  usedAmount?: number
}
export type CategorySliceState = Record<string, Category>
// export type CategorySliceState = Category[]

const initialState: CategorySliceState = {}

export const categoriesSlice = createAppSlice({
  name: "categories",
  initialState,
  reducers: {
    addManyPartialCategories(state, action: PayloadAction<CategoryFromLogin>) {
      const categories = action.payload
      for (const c of categories) {
        state[c.id] = c
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
        // state[category.id] = { ...state[category.id], ...category }
      }
    },
    addManyCategories(state, action: PayloadAction<Category[]>) {
      const categories = action.payload
      for (const category of categories) {
        if (category) {
          state[category.id] = category
        }
      }
      // state = [...categories]
    },
    removeManyCategories(state, action: PayloadAction<string[]>) {
      const catIds = action.payload
      for (const catId of catIds) {
        delete state[catId]
      }
    },
  },

  selectors: {
    selectCategories: state => state,
    selectCategoryById: (state, id: string) => state[id],
    // selectCategoryById: createSelector(
    //   [(state) => state],
    //   (state, id: string) => state[id],
    // ),
    selectCatIds: state => Object.keys(state),
  },
})

export const memoizedSelectCArr = createSelector(
  [(state: RootState) => state.categories],
  state => Object.values(state),
)

// export const memoizedSelectCatById = createSelector(
//   [(state: RootState) => state.categories],
//   (state, id: string) => state[id],
// )
// Action creators are generated for each case reducer function.
export const {
  addManyPartialCategories,
  addCategoryFromTransaction,
  addManyCategoriesFromTransaction,
  addManyCategories,
  removeManyCategories,
} = categoriesSlice.actions

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { selectCategories, selectCategoryById, selectCatIds } =
  categoriesSlice.selectors
