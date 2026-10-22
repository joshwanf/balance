import { PrismaClient } from "@prisma/client"
import { makeUser } from "./seeders/users"
import { makeAccounts } from "./seeders/accounts"
import { makeCategories } from "./seeders/categories"
import { makeCategoryMonths } from "./seeders/categoryMonths"
import { makeTransactions } from "./seeders/transactions"

const prisma = new PrismaClient()

const startingMonth = "2026-04"
const demoUser = makeUser()
const demoAccounts = makeAccounts(demoUser.id)
const demoCategories = makeCategories(demoUser.id)
const demoCategoryMonths = makeCategoryMonths(
  demoUser.id,
  demoCategories.map(cat => cat.id),
  { startingMonth },
)
const demoTransactions = makeTransactions(
  demoUser.id,
  demoAccounts.map(acct => acct.id),
  demoCategories.map(cat => cat.id),
  { startingMonth },
)

async function main() {
  console.log(`Start seeding ...`)

  for (const x of [demoUser]) {
    const result = await prisma.user.create({
      data: x,
    })
  }
  console.log(`Seeded users`)

  for (const x of demoAccounts) {
    const result = await prisma.account.create({
      data: x,
    })
  }
  console.log(`Seeded accounts`)

  for (const x of demoCategories) {
    const result = await prisma.category.create({
      data: x,
    })
  }
  console.log(`Seeded categories`)

  for (const x of demoCategoryMonths) {
    const result = await prisma.categoryMonth.create({
      data: x,
    })
  }
  console.log(`Seeded category months`)

  for (const x of demoTransactions) {
    const result = await prisma.transaction.create({
      data: x,
    })
  }
  console.log(`Seeded transactions`)

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
