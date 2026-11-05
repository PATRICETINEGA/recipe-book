import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('demo123', 10)
  const user = await prisma.user.upsert({
    where: { email: 'demo@recipes.app' },
    update: {},
    create: { email: 'demo@recipes.app', password },
  })

  await prisma.recipe.upsert({
    where: { id: 'seed-recipe' },
    update: {},
    create: { id: 'seed-recipe', title: 'Pasta', ingredients: 'Pasta, tomato sauce', steps: 'Boil pasta. Mix with sauce.', ownerId: user.id },
  })

  console.log('Seed done')
}

main().finally(() => prisma.$disconnect())
