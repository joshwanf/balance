import { pc } from "../../../utils/prismaClient"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { cleanName } from "../../../utils/helpers/cleanName"

export const checkValidBudgetName = async (name: string, userId: string) => {
  console.log("checking valid budget name")

  const cleanedName = cleanName(name)
  try {
    const found = await pc.budget.findMany({
      where: { AND: { cleanedName, userId } },
    })
    if (found.length > 0) {
      console.log("found an existing budget with the same name")
      throw {
        title: "Couldn't create budget",
        message: "Budget with that name already exists",
        status: 400,
      }
    }

    return cleanedName
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      throw { title: "prisma error", message: e, status: 404 }
    }
    throw e
  }
}

export const confirmB = async (id: string, userId: string) => {
  console.log("confirming budget")
  //   try {
  const found = await pc.budget.findUnique({ where: { id } })
  console.log("found budget")
  const isValid = found && userId === found.userId
  if (!isValid) {
    throw {
      title: "Couldn't find budget",
      message: "Budget couldn't be found, or the user isn't authorized",
      status: 404,
    }
  }
  return true
  //   } catch (e) {
  //     if (e instanceof PrismaClientKnownRequestError) {
  //       throw { title: "prisma error", message: e, status: 404 }
  //     }
  //     throw e
  //   }
}
