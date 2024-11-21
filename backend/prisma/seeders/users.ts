import { uuidv7 } from "uuidv7"
import { Prisma } from "@prisma/client"

// import { cleanName } from "../../src/utils/cleanName"
import { user1Transactions } from "./transactions"

export const users: Prisma.UserCreateInput[] = [
  {
    /** User 1 */
    id: uuidv7(),
    firstName: "Adam",
    lastName: "In",
    username: "admin",
    email: "demo@user.io",
    hashedPassword: "password",
  },
  {
    /** User 2 */
    id: uuidv7(),
    firstName: "Jane",
    lastName: "Doe",
    username: "jane.doe",
    email: "jane.doe@user.io",
    hashedPassword: "password",
  },
  {
    /** User 3 */
    id: uuidv7(),
    firstName: "John",
    lastName: "Doe",
    username: "john.doe",
    email: "john.doe@user.io",
    hashedPassword: "password",
  },
]
