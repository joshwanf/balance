import { pc } from "../../../utils/prismaClient"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"

export const confirmT = async (transactionId: string, userId: string) => {
  console.log("confirming transaction")
  try {
    const foundT = await pc.transaction.findUnique({
      where: { id: transactionId },
    })
    console.log("found transaction")
    const isValidT = foundT && userId === foundT.userId
    if (!isValidT) {
      throw {
        title: "Couldn't find transaction",
        message: "Transaction couldn't be found, or the user isn't authorized",
        status: 404,
      }
    }
    return true
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      throw { title: "prisma error", message: e, status: 404 }
    }
    throw e
  }
}
