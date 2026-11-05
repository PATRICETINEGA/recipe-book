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

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const recipe = await prisma.recipe.findUnique({ where: { id } })
  if (!recipe || recipe.ownerId !== (session.user as any).id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  await prisma.recipe.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
