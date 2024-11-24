import internal from "stream"

// import * as UserTypes from "../utils/types/api/user"
export declare namespace ApiTypes {
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
        userInfo: {
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
      hashedPassword: string
    }
    export interface LogInSuccess {
      status: "success"
      success: {
        token: string
        userInfo: {
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

  namespace Transaction {
    interface Transaction {
      amount: string
      date: string
      id: string
      itemId: string | null
      payee: string
      receiptUrl: string | null
      userId: string
    }
    interface ListTransactions extends Transaction {}

    interface CreateTransactionRequest {
      payee: string
      amount: string
      date: DateTime
      receiptUrl?: string
      // categoryItemId?: string
      itemName?: string
    }
    interface ChangeTransactionRequest {
      amount: string
      date: string
      item: {
        id: string
        name: string
      }
      payee: string
      receiptUrl: string
    }
    interface CreateTransactionResponse extends GenericTransactionResponse {}
    interface CreateTransactionValidationError {
      type: string
      message: string
    }
    interface CreateTransactionInvalidCredentialError {
      type: "Invalid request"
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
    type CreateBudgetRequest = {
      name: string
    }
  }

  /** Item */
  namespace Item {
    interface Item {
      id: string
      name: string
      cleanedName: string
      userId: string
    }
    interface Group {
      userId: string
      itemId: string
    }
    type CreateRequest = {
      name: string
    }
  }
}
