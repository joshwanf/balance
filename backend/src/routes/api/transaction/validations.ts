import { checkSchema, validationResult } from "express-validator"
import { ApiTypes } from "../../../types/api"
import { Request, Response, NextFunction } from "express-serve-static-core"

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
type Req = {}
type Res = {}

type Handler = ApiTypes.CustomRouteHandler<Req, Res>
export const handleValidationErrors = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const validationErrors = validationResult(req)

  if (!validationErrors.isEmpty()) {
    // @ts-ignore
    // const errors: Record<string, string> = {}
    // validationErrors.array().forEach(error => (errors[error.path] = error.msg))
    const errors = validationErrors.mapped(e => e.msg)

    const err = {
      title: "Bad request.",
      error: validationErrors.array(),
      status: 400,
    }
    next(err)
  }
  next()
}

export const createValidation = [
  checkSchema({
    payee: {
      exists: true,
      errorMessage: "Must have a payee",
    },
    date: {
      matches: {
        options: /\d{4}-\d{2}-\d{2}/,
      },
      errorMessage: "Date must be in form YYYY-MM-DD",
    },
  }),
  handleValidationErrors,
]

// const allSpotsValidation = [
//   checkSchema({
//     date: {},
//     page: {
//       optional: true,
//       isInt: { options: { min: 1 } },
//       toInt: true,
//       errorMessage: "Page must be an integer",
//     },
//     size: {
//       optional: true,
//       isInt: { options: { gt: 1, lt: 20 } },
//       toInt: true,
//       errorMessage: "Size must be between 1 and 20",
//     },
//     minLat: {
//       optional: true,
//       isFloat: { options: true },
//       toFloat: true,
//       errorMessage: "Minimum latitude is invalid",
//     },
//     maxLat: {
//       optional: true,
//       isFloat: {
//         errorMessage: "Maximum latitude is invalid",
//         options: true,
//       },
//       toFloat: true,
//     },
//     minLng: {
//       optional: true,
//       isFloat: {
//         errorMessage: "Minimum longitude is invalid",
//         options: true,
//       },
//       toFloat: true,
//     },
//     maxLng: {
//       optional: true,
//       isFloat: {
//         errorMessage: "Maximum latitude is invalid",
//         options: true,
//       },
//       toFloat: true,
//     },
//     minPrice: {
//       optional: true,
//       isFloat: {
//         errorMessage: "Minimum price must be greater than or equal to 0",
//         options: {
//           min: 0,
//         },
//       },
//       isDecimal: { errorMessage: "Min price must be a number" },
//       toFloat: true,
//     },
//     maxPrice: {
//       optional: true,
//       isFloat: {
//         errorMessage: "Maximum price must be greater than or equal to 0",
//         options: {
//           min: 0,
//         },
//       },
//       // isDecimal: { errorMessage: "Max price must be a number", options: {min: 100 } },
//       toFloat: true,
//     },
//   }),
//   handleValidationErrors,
// ]
