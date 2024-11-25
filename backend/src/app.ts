import express, { ErrorRequestHandler } from "express"
import "express-async-errors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import morgan from "morgan"
import helmet from "helmet"
import csurf from "csurf"

import config from "./config"
import routes from "./routes"

dotenv.config()
const { environment, port, jwtConfig } = config
const isProduction = environment === "production"

const app = express()

app.use(morgan("dev"))
app.use(cookieParser())
app.use(express.json())

// Security Middleware
if (!isProduction) {
  // enable cors only in development
  app.use(cors())
}

// helmet helps set a variety of headers to better secure your app
app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin",
  })
)

// // Set the _csrf token and create req.csrfToken method
// app.use(
//   csurf({
//     cookie: {
//       secure: isProduction,
//       sameSite: isProduction && "lax",
//       httpOnly: true,
//     },
//   })
// )

app.use(routes)
app.post("/ping", (req, res) => {
  res.status(200).send("pong")
})

// Catch unhandled requests and forward to error handler.
app.use((_req, _res, next) => {
  console.log("catching unhandled requests")
  const error = {
    status: 404,
    title: "Resource Not Found",
    errors: { message: "The requested resource couldn't be found." },
  }
  next(error)
})

// Error formatter
const errorFormatter: ErrorRequestHandler = (err, _req, res, _next) => {
  console.log("in error handler", err)
  res.status(err.status || 500)
  res.send(err)
}
app.use(errorFormatter)

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

module.exports = app
