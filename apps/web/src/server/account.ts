import moment from "moment"
import { uuidv7 } from "uuidv7"
import { pc } from "@/server/prisma"
import { cleanName } from "@/server/utils/cleanName"

export const createAccount = async (
  userId: string,
  {
    name,
    accountType,
    initialBalance,
  }: {
    name: string
    accountType: string
    initialBalance: number
  },
): Promise<{
  account: {
    id: string
    name: string
    cleanedName: string
    accountType: string
    userId: string
  }
} | null> => {
  const account = await pc.account.create({
    data: {
      id: uuidv7(),
      userId,
      name,
      cleanedName: cleanName(name),
      accountType,
      transactions: {
        create: [
          {
            id: uuidv7(),
            date: moment().format("YYYY-MM-DD"),
            amount: initialBalance,
            payee: "Initial balance",
            type: "incoming",
            userId,
          },
        ],
      },
    },
  })

  return { account }
}

export const deleteAccount = async (
  userId: string,
  accountId: string,
): Promise<number> => {
  const { count } = await pc.account.deleteMany({
    where: { id: accountId, userId },
  })
  return count
}
