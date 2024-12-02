import { useState, useEffect } from "react"
import { useAppSelector, useAppDispatch } from "./app/hooks"
import { login, selectUser } from "./features/sessionSlice"
import { Landing } from "./components/Landing/Landing"
import { TransactionsList } from "./components/Transactions/TransactionsList"
import { Main } from "./components/Main/Main"
import { CategoryList } from "./components/Budgets/CategoryList"
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom"
import { restoreSession } from "./utils/thunks/session"
import { AccountList } from "./components/Accounts/AccountList"
import { TrendsList } from "./components/Trends/TrendsList"
import { Dashboard } from "./components/Main/Dashboard"

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
          { path: "", element: <Dashboard /> },
          { path: "budgets", element: <CategoryList /> },
          { path: "transactions", element: <TransactionsList /> },
          { path: "accounts", element: <AccountList /> },
          { path: "trends", element: <TrendsList /> },
        ],
      },
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
}
export default App
