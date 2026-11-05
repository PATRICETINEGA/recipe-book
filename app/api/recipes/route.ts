import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { title, ingredients, steps } = body
  if (!title) return NextResponse.json({ error: 'Title required' }, { status: 400 })

  const recipe = await prisma.recipe.create({
    data: { title, ingredients, steps, ownerId: (session.user as any).id },
  })
  return NextResponse.json(recipe)
}
