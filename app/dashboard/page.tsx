import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import AddRecipe from '@/components/AddRecipe'
export default async function Dash() {
  const s = await getSession()
  if (!s) redirect('/login')
  const uid = (s.user as any).id
  const recipes = await prisma.recipe.findMany({ where: { ownerId: uid }, orderBy: { createdAt: 'desc' } })
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Recipes</h1>
        <Link href="/api/auth/signout" className="text-sm text-red-600">Sign out</Link>
      </div>
      <AddRecipe />
      <div className="space-y-3">
        {recipes.map((r: any) => (
          <div key={r.id} className="bg-white p-4 rounded shadow text-sm">
            <p className="font-medium">{r.title}</p>
            {r.ingredients && <p className="text-gray-600 mt-1">Ingredients: {r.ingredients}</p>}
            {r.steps && <p className="text-gray-500 mt-1">Steps: {r.steps}</p>}
          </div>
        ))}
        {recipes.length === 0 && <p className="text-gray-500">No recipes yet</p>}
      </div>
    </div>
  )
}
