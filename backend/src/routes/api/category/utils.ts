import { pc } from "../../../utils/prismaClient"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { cleanName } from "../../../utils/helpers/cleanName"

export const checkValidCategoryName = async (name: string, userId: string) => {
  console.log("checking valid category name")

  const cleanedName = cleanName(name)
  try {
    const found = await pc.category.findMany({
      where: { AND: { cleanedName, userId } },
    })
    if (found.length > 0) {
      console.log("found an existing budget with the same name")
      throw {
        title: "Couldn't create budget",
        message: "Category with that name already exists",
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

export const confirmC = async (id: string, userId: string) => {
  console.log("confirming category")
  //   try {
  const found = await pc.category.findUnique({ where: { id } })
  console.log("found category")
  const isValid = found && userId === found.userId
  if (!isValid) {
    throw {
      title: "Couldn't find category",
      message: "Category couldn't be found, or the user isn't authorized",
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
