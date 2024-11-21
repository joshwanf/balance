import { uuidv7 } from "uuidv7"
import { prisma } from "../../prisma/prismaClient"

const main = async () => {
  console.log("beginning insert")
  const input = {
    itemName: "Clothing",
    itemCleanedName: "clothing",
  }
  const { itemName, itemCleanedName } = input
  const item = await prisma.item.upsert({
    create: {
      id: uuidv7(),
      name: itemName,
      cleanedName: itemCleanedName,
    },
    update: {},
    where: { cleanedName: itemCleanedName },
  })
  //   const nextItem = await prisma.item.upsert({
  //     create: {
  //       id: "3",
  //       name: itemName,
  //       cleanedName: itemCleanedName,
  //     },
  //     update: {},
  //     where: { cleanedName: itemCleanedName },
  //   })
  //   console.log(item, nextItem)
  console.log("finished insert")
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
