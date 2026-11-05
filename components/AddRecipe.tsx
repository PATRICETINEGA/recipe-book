'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
export default function AddRecipe() {
  const [title, setTitle] = useState('')
  const [ingredients, setIngredients] = useState('')
  const [steps, setSteps] = useState('')
  const [loading, setLoading] = useState(false)
  const r = useRouter()
  async function submit(e: any) {
    e.preventDefault()
    setLoading(true)
    await fetch('/api/recipes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, ingredients, steps }) })
    setTitle(''); setIngredients(''); setSteps(''); setLoading(false); r.refresh()
  }
  return (
    <form onSubmit={submit} className="bg-white p-4 rounded shadow mb-4 space-y-2">
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Recipe title" className="w-full border p-2 rounded text-sm" required />
      <textarea value={ingredients} onChange={e=>setIngredients(e.target.value)} placeholder="Ingredients" className="w-full border p-2 rounded text-sm" rows={2} />
      <textarea value={steps} onChange={e=>setSteps(e.target.value)} placeholder="Steps" className="w-full border p-2 rounded text-sm" rows={2} />
      <button type="submit" disabled={loading} className="bg-amber-600 text-white px-4 py-1 rounded text-sm disabled:opacity-50">Add</button>
    </form>
  )
}
