import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom"
import "./App.css"
import { Counter } from "./features/counter/Counter"
import { Quotes } from "./features/quotes/Quotes"
import logo from "./logo.svg"

// import { NavBar } from "./components/NavBar/NavBar"
// import { Sidebar } from "./components/Sidebar/Sidebar"
// import { HomePage } from "./components/HomePage/HomePage"
// import { AllQuestions } from "./components/AllQuestions/AllQuestions"
// import { QuestionMain } from "./components/Question/QuestionMain"
// import { CreateOrEditPost } from "./components/Post/CreateOrEditPost"
// import { Footer } from "./components/Footer/Footer"
// import { Contact } from "./components/Contact/Contact"
// import { FAQ } from "./components/FAQ/FAQ"
// import { AboutUs } from "./components/AboutUs/AboutUs"
// import { UserDetailPage } from "./components/User/UserDetailPage"
// import { AllTags } from "./components/AllTags/AllTags"
// import { AccountDetails } from "./components/User/AccountDetails"
// // import { TaggedQuestions } from "./components/AllQuestions/TaggedQuestions"
// import AllSaves from "./components/Save/allSaves"
const Layout = () => {
  return (
    <h1>layout</h1>
    // <>
    //   <NavBar />
    //   <div className="main">
    //     <Sidebar />
    //     <Outlet />
    //   </div>
    //   <Footer />
    // </>
  )
}

// const router = createBrowserRouter([
//   {
//     element: <Layout />,
//     children: [
//       { path: "/", element: <HomePage /> },
//       {
//         path: "questions",
//         children: [
//           { path: "", element: <AllQuestions /> },
//           { path: "ask", element: <CreateOrEditPost /> },
//           {
//             path: ":questionId",
//             children: [
//               { path: "", element: <QuestionMain /> },
//               { path: "edit", element: <CreateOrEditPost /> },
//               { path: "*", element: <QuestionMain /> },
//             ],
//           },
//         ],
//       },
//       {
//         path: "tagged",
//         children: [
//           { path: "", element: <AllTags /> },
//           {
//             path: ":tagId/:tagName",
//             element: <AllQuestions />,
//           },
//           {
//             path: ":tagId/:tagName/:questionId",
//             children: [
//               { path: "", element: <QuestionMain /> },
//               { path: "edit", element: <CreateOrEditPost /> },
//               { path: "*", element: <QuestionMain /> },
//             ],
//           },
//         ],
//       },
//       {
//         path: "saves",
//         element: <AllSaves />,
//       },
//       { path: "/team", element: <Contact /> },
//       { path: "/faq", element: <FAQ /> },
//       { path: "about-us", element: <AboutUs /> },
//       { path: "user/:userId", element: <UserDetailPage /> },
//       { path: "/account", element: <AccountDetails /> },
//     ],
//   },
// ])

// const App = () => {
//   return <RouterProvider router={router} />
// }

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Counter />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <Quotes />
        <span>
          <span>Learn </span>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            React
          </a>
          <span>, </span>
          <a
            className="App-link"
            href="https://redux.js.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Redux
          </a>
          <span>, </span>
          <a
            className="App-link"
            href="https://redux-toolkit.js.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Redux Toolkit
          </a>
          <span>, </span>
          <a
            className="App-link"
            href="https://react-redux.js.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            React Redux
          </a>
          ,<span> and </span>
          <a
            className="App-link"
            href="https://reselect.js.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Reselect
          </a>
        </span>
      </header>
    </div>
  )
}

export default App
