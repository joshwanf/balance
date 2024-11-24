import { uuidv7 } from "uuidv7"
import { PrismaClient } from "@prisma/client"
// import { prisma } from "./prismaClient"
import { users } from "./seeders/users"
import { user1Budgets } from "./seeders/budgets"
import { user1Categories } from "./seeders/categories"
import { user1Items } from "./seeders/items"
import { user1Transactions } from "./seeders/transactions"
import { user1Groups } from "./seeders/groups"
const prisma = new PrismaClient()

async function main() {
  console.log(`Start seeding ...`)

  for (const u of users) {
    const user = await prisma.user.create({
      data: u,
    })
    console.log(`Created user with id: ${user.id}`)
  }

  const budget = await prisma.budget.createMany({
    data: user1Budgets,
  })

  const categories = await prisma.category.createMany({
    data: user1Categories,
  })

  const categoryItems = await prisma.item.createMany({
    data: user1Items,
  })

  const transactions = await prisma.transaction.createMany({
    data: user1Transactions,
  })

  const groups = await prisma.userGroup.createMany({
    data: user1Groups,
  })
  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    // process.exit(1)
  })
