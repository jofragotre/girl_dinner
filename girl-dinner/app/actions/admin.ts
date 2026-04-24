'use server'

import { requireAdmin } from '@/lib/auth'
import { createItem, updateItem, softDeleteItem } from '@/db/queries'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

type Kind = 'recipe' | 'cocktail'

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function createItemAction(formData: FormData) {
  await requireAdmin()

  const kind = formData.get('kind') as Kind
  const name = formData.get('name')!.toString().trim()
  const vibe = formData.get('vibe')?.toString().trim() || null
  const ingredientsRaw = formData.get('ingredients')!.toString()
  const ingredients = ingredientsRaw.split('\n').map((s) => s.trim()).filter(Boolean)
  const moods = (formData.getAll('moods') as string[]).filter(Boolean)
  const id = slugify(name)

  await createItem({ id, kind, name, vibe, ingredients, moods })

  revalidatePath('/')
  revalidatePath('/dishes')
  revalidatePath('/cocktails')
  redirect(`/admin?kind=${kind}`)
}

export async function updateItemAction(formData: FormData) {
  await requireAdmin()

  const id = formData.get('id')!.toString()
  const name = formData.get('name')!.toString().trim()
  const vibe = formData.get('vibe')?.toString().trim() || null
  const ingredientsRaw = formData.get('ingredients')!.toString()
  const ingredients = ingredientsRaw.split('\n').map((s) => s.trim()).filter(Boolean)
  const moods = (formData.getAll('moods') as string[]).filter(Boolean)

  await updateItem(id, { name, vibe, ingredients, moods })

  revalidatePath('/')
  revalidatePath('/dishes')
  revalidatePath('/cocktails')

  const kind = formData.get('kind')!.toString()
  redirect(`/admin?kind=${kind}`)
}

export async function deleteItemAction(formData: FormData) {
  await requireAdmin()

  const id = formData.get('id')!.toString()
  const kind = formData.get('kind')!.toString()

  await softDeleteItem(id)

  revalidatePath('/')
  revalidatePath('/dishes')
  revalidatePath('/cocktails')
  redirect(`/admin?kind=${kind}`)
}
