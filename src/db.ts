import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function main() {
  console.log(await prisma.answer.count())
  console.log(await prisma.question.count())
}

main();
