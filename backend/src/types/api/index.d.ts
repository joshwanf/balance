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

    interface LoginRequest {
      credential: string
      password: string
    }
    interface LoginResponse {
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
            month: string
            amount: number
            usedAmount: number
          }[]
        }
      }
    }
    interface RestoreResponse extends LoginResponse {}

    interface LogOutResponse {
      type: "success"
      success: "Logged out"
    }
    interface CreateRequest {
      firstName: string
      lastName: string
      email: string
      username: string
      password: string
    }
    interface CreateResponse extends SafeUser {}
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

    /** serialization of prisma Decimal and Date types */
    interface TSerialized extends Transaction {
      date: string
      tags: string[]
    }
    interface ListSearchParams {
      startMonth: string
      endMonth?: string
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
      tags: string[]
    }
    interface SearchRequest {
      startDate: string
      endDate: string
      tags: string[]
      generalSearch: string[]
    }
    interface SearchResponse {
      transactions: TSerialized[]
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
      amount: number
      date: string
      categoryName: string
      accountId: string
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
    interface ListSearchParams {
      startMonth: string
      endMonth?: string
    }
    /** serialization of prisma Decimal and Date types */
    interface TSerialized extends Category {
      month: string
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
      name: string
      amount: number
    }
    interface ChangeResponse extends TSerialized {}
    interface RemoveRequest {
      categoryIds: string[]
    }
    interface RemoveResponse {
      type: string
      success: {
        count: number
      }
    }
  }

  /** Account */
  namespace Account {
    interface Account {
      id: string
      name: string
      cleanedName: string
      type: string
    }
    interface ListSearchParams {
      startMonth: string
    }
    interface TSerialized {
      id: string
      name: string
      accountType: string
      usedAmount: number
    }
    interface ListRequest {}
    interface ListResponse {
      accounts: TSerialized[]
    }
    interface CreateRequest {
      name: string
      accountType: string
      initialBalance: number
    }
    interface CreateResponse {
      accounts: TSerialized[]
    }
    interface ChangeRequest {
      name: string
      accountType: string
    }
    interface ChangeResponse {
      id: string
      name: string
      accountType: string
    }
    interface RemoveRequest {
      accountIds: string[]
    }
    interface RemoveResponse {
      type: string
      success: {
        count: number
      }
    }
  }

  namespace Trend {
    interface SearchParams {
      startMonth: string
      endMonth?: string
    }
    interface OverviewRequest {}
    interface OverviewResponse {
      summary: {
        total: {
          outgoing: number
          incoming: number
        }
        byMonth: {
          outgoing: Array<number | undefined>
          incoming: Array<number | undefined>
        }
      }
      categories: {
        id: string
        name: string
        outgoing: Array<number>
        incoming: Array<number>
      }[]
    }
    type Slice = { name: string; spent: number }
    type PieChart = {
      month: string
      summary: Slice[]
    }
    interface CompareRequest {
      month1: string
      month2: string
    }
    type CompareResponse = PieChart[]
  }

  /** Tag */
  namespace Tag {
    interface Tag {
      id: string
      name: string
      // cleanedName: string
    }
    interface ListRequest {}
    interface ListResponse {
      tags: {
        id: string
        name: string
        transactions: {
          id: string
          date: string
          payee: string
          amount: number
        }[]
      }[]
    }
    interface AddRequest {
      tags: string[]
    }
    interface AddResponse {
      tags: Tag[]
    }
    interface RemoveRequest {
      tags: string[]
    }
    interface RemoveResponse {
      tags: Tag[]
    }
  }
}
