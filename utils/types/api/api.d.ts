import internal from "stream"

// import * as UserTypes from "../utils/types/api/user"
export declare namespace API {
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
    interface CreateTransactionRequest {
      payee: string
      amount: number
      date: DateTime
      receiptUrl?: string
      // categoryItemId?: string
      itemName?: string
    }
    interface GenericTransactionResponse {
      id: string
      payee: string
      amount: number
      date: DateTime
      receiptUrl: string | null
      itemId: string | null
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
}
