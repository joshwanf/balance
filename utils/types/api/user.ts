/** User */

export interface GenericUserResponse {
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
