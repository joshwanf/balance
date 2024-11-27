import { uuidv7 } from "uuidv7"
import { PrismaClient } from "@prisma/client"
// import { prisma } from "./prismaClient"
import { users } from "./seeders/users"
import { accounts } from "./seeders/accounts"
import { transactions } from "./seeders/transactions"
import { categories } from "./seeders/categories"
import { categoryMonths } from "./seeders/categoryMonths"

const prisma = new PrismaClient()

async function main() {
  console.log(`Start seeding ...`)

  for (const x of users) {
    const result = await prisma.user.create({
      data: x,
    })
    console.log(`Created user with id: ${result.id}`)
  }

  for (const x of accounts) {
    const result = await prisma.account.create({
      data: x,
    })
    console.log(`Created user with id: ${result.id}`)
  }

  for (const x of categories) {
    const result = await prisma.category.create({
      data: x,
    })
    console.log(`Created user with id: ${result.id}`)
  }

  for (const x of categoryMonths) {
    const result = await prisma.categoryMonth.create({
      data: x,
    })
    console.log(`Created user with id: ${result.id}`)
  }

  for (const x of transactions) {
    const result = await prisma.transaction.create({
      data: x,
    })
    console.log(`Created user with id: ${result.id}`)
  }

  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
