import { Decimal } from "@prisma/client/runtime/library"
import {
  NextFunction,
  Request,
  Response,
  ParamsDictionary,
  ParsedQs,
} from "express-serve-static-core"

declare module "express-serve-static-core" {
  interface Request {
    user: ApiTypes.Session.SafeUser | null
  }
}

export declare namespace ApiTypes {
  type CustomRouteHandler<TReq, TRes> = (
    req: Request<ParamsDictionary, {}, TReq, ParsedQs>,
    res: Response<TRes>,
    next: NextFunction
  ) => Promise<void> | void

  namespace Session {
    /** Session */
    interface SafeUser {
      id: string
      firstName: string
      lastName: string
      email: string
      username: string
    }

    export interface LoginRequest {
      credential: string
      password: string
    }
    export interface LoginResponse {
      status: "success"
      success: {
        user: SafeUser & {
          accounts: {
            id: string
            name: string
          }[]
          categories: {
            id: string
            name: string
          }[]
        }
      }
    }
    interface RestoreResponse extends LoginResponse {
      status: "success"
      success: {
        user: SafeUser & {
          accounts: {
            id: string
            name: string
          }[]
          categories: {
            id: string
            name: string
          }[]
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
      id: string
      userId: string
      amount: number
      categoryId: string | null
      type: string
      payee: string
      date: string
      accountId: string
    }
    interface TransactionWithCat extends Transaction {
      category: {
        id: string
        name: string
        cleanedName: string
        amount: string
        usedAmount: string
      } | null
      account: {
        id: string
        name: string
        cleanedName: string
      }
    }

    /** serialization of prisma Decimal and Date types */
    interface TSerialized extends Transaction {
      date: string
    }
    interface ListRequest {}
    interface ListResponse {
      transactions: TSerialized[]
      categories: {
        id: string
        name: string
        month: string
        amount: number
        usedAmount: number
      }[]
    }
    interface CreateRequest {
      /** change type to 'outgoing' | 'incoming' ? */
      type: string
      payee: string
      amount: number
      date: string
      categoryName?: string
      accountId: string
    }
    interface CreateResponse extends TSerialized {}
    interface RetrieveRequest {}
    interface RetrieveTransactionResponse extends TSerialized {}
    interface ChangeRequest {
      type: string
      payee: string
      amount: string
      date: string
      categoryName: string
    }
    interface ChangeResponse extends TSerialized {}
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
      amount: number
    }
    /** serialization of prisma Decimal and Date types */
    interface TSerialized extends Category {
      usedAmount: number
    }
    interface ListRequest {}
    interface ListResponse {
      categories: TSerialized[]
    }
    interface CreateRequest {
      name: string
      amount: number
    }
    interface CreateResponse extends TSerialized {}
    interface RetrieveRequest {}
    interface RetrieveResponse extends TSerialized {}
    interface ChangeRequest {
      name?: string
      amount?: string
    }
    interface ChangeResponse extends TSerialized {}
    interface RemoveRequest {}
    interface RemoveResponse {
      type: string
      success: string
    }
  }

  /** Account */
  namespace Account {
    interface Account {
      id: string
      name: string
      cleanedName: string
    }
  }
}
