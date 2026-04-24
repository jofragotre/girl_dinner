import { db } from '../db/client'
import { items } from '../db/schema'
import recipes from '../data/recipes.json'
import cocktails from '../data/cocktails.json'
import type { Recipe, Cocktail } from '../lib/types'

async function seed() {
  const recipeRows = (recipes as Recipe[]).map((r) => ({
    id: r.id,
    kind: 'recipe' as const,
    name: r.name,
    vibe: r.vibe ?? null,
    ingredients: r.ingredients,
    moods: r.moods ?? [],
  }))

  const cocktailRows = (cocktails as Cocktail[]).map((c) => ({
    id: `c-${c.id}`,
    kind: 'cocktail' as const,
    name: c.name,
    vibe: c.vibe ?? null,
    ingredients: c.ingredients,
    moods: c.moods ?? [],
  }))

  await db
    .insert(items)
    .values([...recipeRows, ...cocktailRows])
    .onConflictDoNothing()

  console.log(`Seeded ${recipeRows.length} recipes and ${cocktailRows.length} cocktails.`)
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
