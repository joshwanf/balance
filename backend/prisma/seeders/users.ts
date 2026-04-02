import { uuidv7 } from "uuidv7"
import { Prisma } from "@prisma/client"

export const makeUser = (): Prisma.UserCreateManyInput => ({
  id: uuidv7(),
  firstName: "Adam",
  lastName: "In",
  username: "admin",
  email: "demo@user.io",
  hashedPassword: "password",
})
