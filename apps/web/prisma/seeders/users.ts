import { uuidv7 } from "uuidv7"
import bcrypt from "bcryptjs"
import { Prisma } from "@prisma/client"

// Demo login: admin / password
export const makeUser = (): Prisma.UserCreateManyInput => ({
  id: uuidv7(),
  firstName: "Adam",
  lastName: "In",
  username: "admin",
  email: "demo@user.io",
  hashedPassword: bcrypt.hashSync("password", 12),
})
