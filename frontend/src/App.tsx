import { useState, useEffect } from "react"
import { useAppSelector, useAppDispatch } from "./app/hooks"
import { login, selectUser } from "./features/sessionSlice"
import { Landing } from "./components/Landing/Landing"
import balance from "./utils/api"
import { ApiError } from "./utils/classes/ApiError"
import { TopBar } from "./components/Landing/TopBar"
import { TransactionsList } from "./components/Transactions/TransactionsList"
import { Main } from "./components/Main/Main"
import { CategoryList } from "./components/Budgets/CategoryList"
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom"
import { addManyPartialCategories } from "./features/categoriesSlice"
import { addManyAccounts } from "./features/accountsSlice"
import { restoreSession } from "./utils/thunks/session"

const Layout = () => {
  return (
    <div>
      <Outlet />
    </div>
  )
}

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Landing /> },
      {
        path: "my-balance",
        element: <Main />,
        children: [
          // { path: "", },
          { path: "budgets", element: <CategoryList /> },
          { path: "transactions", element: <TransactionsList /> },
          { path: "accounts", element: <h1>Accounts</h1> },
        ],
      },
      // {
      //   path: "tagged",
      //   children: [
      //     // { path: "", element: <AllTags /> },
      //     // { path: ":tagId/:tagName", element: <AllQuestions /> },
      //     // {
      //     //   path: ":tagId/:tagName/:questionId",
      //     //   children: [
      //     //     { path: "", element: <QuestionMain /> },
      //     //     { path: "edit", element: <CreateOrEditPost /> },
      //     //     { path: "*", element: <QuestionMain /> },
      //     //   ],
      //     // },
      //   ],
      // },
      // { path: "saves", element: <AllSaves /> },
      // { path: "/team", element: <Contact /> },
      // { path: "/faq", element: <FAQ /> },
      // { path: "about-us", element: <AboutUs /> },
      // { path: "user/:userId", element: <UserDetailPage /> },
      // { path: "/account", element: <AccountDetails /> },
    ],
  },
])

const App = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(restoreSession())
  }, [dispatch, restoreSession])

  const session = useAppSelector(selectUser)
  return <RouterProvider router={router} />
  // return <div>{session ? <Main /> : <Landing />}</div>
}
export default App
