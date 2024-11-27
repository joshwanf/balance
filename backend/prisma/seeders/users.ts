import { uuidv7 } from "uuidv7"
import { Prisma } from "@prisma/client"
import { cleanName } from "../../src/utils/helpers/cleanName"

export const users: Prisma.UserCreateManyInput[] = [
  {
    id: uuidv7(),
    firstName: "Adam",
    lastName: "In",
    username: "admin",
    email: "demo@user.io",
    hashedPassword: "password",
  },
  {
    id: uuidv7(),
    firstName: "Jane",
    lastName: "Doe",
    username: "jane.doe",
    email: "jane.doe@user.io",
    hashedPassword: "password",
  },
  {
    id: uuidv7(),
    firstName: "John",
    lastName: "Doe",
    username: "john.doe",
    email: "john.doe@user.io",
    hashedPassword: "password",
  },
]
