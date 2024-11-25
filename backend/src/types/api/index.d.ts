import { Decimal } from "@prisma/client/runtime/library"
import {
  NextFunction,
  Request,
  Response,
  ParamsDictionary,
  ParsedQs,
} from "express-serve-static-core"

// import * as UserTypes from "../utils/types/api/user"
export declare namespace ApiTypes {
  type CustomRouteHandler<TReq, TRes> = (
    req: Request<ParamsDictionary, {}, TReq, ParsedQs>,
    res: Response<TRes>,
    next: NextFunction,
  ) => Promise<void>

  namespace Session {
    /** Session */
    interface SafeUser {
      id: string
      firstName: string
      lastName: string
      email: string
      username: string
    }

    export interface RestoreSessionResponse {
      status: "success"
      success: {
        token: string
        user: {
          id: string
          firstName: string
          lastName: string
          email: string
          username: string
        } | null
      }
    }
    export interface LogInRequest {
      credential: string
      password: string
    }
    export interface LogInSuccess {
      status: "success"
      success: {
        token: string
        user: {
          id: string
          firstName: string
          lastName: string
          email: string
          username: string
        }
      }
    }
    export interface LogInInvalidRequest {
      status: "rejected"
      rejected: {
        type: "request"
        message: "Both credential and password must be supplied"
      }
    }
    export interface LogInInvalidCredential {
      status: "rejected"
      rejected: {
        type: "credential"
        message: "Invalid credentials"
      }
    }
    export interface LogInUnknownError {
      status: "rejected"
      rejected: {
        type: "unknown"
        message: string
      }
    }
    export interface LogOutSuccessResponse {
      type: "success"
      success: "Logged out"
    }
    export interface LogOutErrorResponse {
      type: "error"
      error: string
    }
  }

  /** User */
  namespace User {
    interface GenericUserResponse {
      id: string
      firstName: string
      lastName: string
      email: string
      username: string
      hashedPassword: string
    }
    /** Create one user */
    export interface CreateUserRequest {
      firstName: string
      lastName: string
      email: string
      username: string
      hashedPassword: string
    }
    export interface CreateUserResponse extends GenericUserResponse {}
    export interface CreateUserUniqueConstraintError {
      type: "Invalid request"
      message: string
    }
    export interface CreateUserValidationError {
      type: "Invalid request"
      message: string
    }

    /** Edit one user */
    export interface EditUserRequest {
      firstName?: string
      lastName?: string
      email?: string
      username?: string
      hashedPassword?: string
    }
    export interface CreateUserResponse extends GenericUserResponse {}

    /** Delete one user */
    export interface DeleteOneUserRequest {
      id: string
    }
  }

  /** Transaction */
  namespace Transaction {
    interface Transaction {
      amount: Decimal
      date: Date
      id: string
      payee: string
      userId: string
    }
    interface TransactionWithCat extends Transaction {
      category: {
        id: string
        name: string
        cleanedName: string
      } | null
      account: {
        id: string
        name: string
        cleanedName: string
      }
    }
    interface CreateTransactionRequest {
      type: string
      payee: string
      amount: Decimal
      date: Date
      itemName?: string
      accountId: string
    }
    interface ChangeTransactionRequest {
      amount: string
      date: string
      item: {
        id?: string
        name: string
      }
      payee: string
      receiptUrl: string
    }
    /** serialization of prisma Decimal and Date types */
    interface TSerialized extends TransactionWithCat {
      amount: string
      date: string
    }
    interface ListTransactionsResponse {
      transactions: TListTransRes[]
    }
    interface RetrieveTransactionResponse extends TSerialized {}
    interface CreateTransactionResponse extends TSerialized {}
    interface ChangeTransanctionResponse extends TSerialized {}
    interface RemoveTransactionResponse {
      type: string
      message: string
    }
  }

  /** Budget */
  namespace Budget {
    interface Budget {
      id: string
      name: string
      cleanedName: string
      userId: string
    }
    interface CreateBudgetRequest {
      name: string
    }
    interface ListBudgetsResponse {
      budgets: Budget[]
    }
    interface RetrieveBudgetResponse {}
    interface CreateBudgetResponse {}
    interface RemoveBudgetResponse {
      type: string
      success: string
    }
  }

  /** Category */
  namespace Category {
    interface Category {
      id: string
      name: string
      cleanedName: string
      amount: Decimal
      userId: string
    }
    /** serialization of prisma Decimal and Date types */
    interface TSerialized extends Category {
      amount: string
    }
    interface Group {
      userId: string
      itemId: string
    }
    interface CreateCategoryRequest {
      id?: string
      name: string
      amount: Decimal
    }
    interface ListResponse {
      categories: TSerialized[]
    }
    interface RetrieveResponse extends TSerialized {}
    interface CreateCategoryResponse {}
    interface RemoveCategoryResponse {
      type: string
      success: string
    }
  }

  // /** Category */
  // namespace Category {
  //   interface Category {
  //     id: string
  //     name: string
  //     cleanedName: string
  //     amount: string
  //   }
  //   interface CategoryWithItems extends Category {
  //     Items: Item.Item[]
  //   }
  //   interface ListCategoriesResponse {
  //     categories: CategoryWithItems[]
  //   }
  // }
}
