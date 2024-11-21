import { GenericUserResponse } from "./user"
/** Session */

export interface LogInRequest {
  credential: string
  hashedPassword: string
}
export interface LogInSuccess {
  id: string
  firstName: string
  lastName: string
  email: string
  username: string
}
export interface LogInInvalidRequest {
  type: "Invalid request"
  message: "Both credential and password must be supplied"
}
export interface LogInInvalidCredential {
  type: "Invalid credentials"
  message: "Invalid credentials"
}
export interface LogOutSuccessResponse {
  type: "success"
  success: "Logged out"
}
