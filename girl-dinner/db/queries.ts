import { db } from './client'
import { items, votes, type ItemInsert } from './schema'
import { eq, isNull, sql, desc, asc, and } from 'drizzle-orm'
import { getTableColumns } from 'drizzle-orm'

type Kind = 'recipe' | 'cocktail'
type Sort = 'score' | 'new' | 'alpha'

const scoreExpr = sql<number>`coalesce(sum(${votes.value}), 0)`

export async function listItems(kind: Kind, sort: Sort = 'score') {
  const query = db
    .select({ ...getTableColumns(items), score: scoreExpr })
    .from(items)
    .leftJoin(votes, eq(votes.itemId, items.id))
    .where(and(eq(items.kind, kind), isNull(items.deletedAt)))
    .groupBy(items.id)

  if (sort === 'score') return query.orderBy(desc(scoreExpr), asc(items.name))
  if (sort === 'new') return query.orderBy(desc(items.createdAt))
  return query.orderBy(asc(items.name))
}

export async function getItem(id: string) {
  const [item] = await db.select().from(items).where(eq(items.id, id)).limit(1)
  return item ?? null
}

export async function getUserVotes(userId: string): Promise<Map<string, number>> {
  const rows = await db
    .select({ itemId: votes.itemId, value: votes.value })
    .from(votes)
    .where(eq(votes.userId, userId))
  return new Map(rows.map((r) => [r.itemId, r.value]))
}

export async function upsertVote(userId: string, itemId: string, value: 1 | -1) {
  await db
    .insert(votes)
    .values({ userId, itemId, value })
    .onConflictDoUpdate({
      target: [votes.userId, votes.itemId],
      set: { value },
    })
}

export async function clearVote(userId: string, itemId: string) {
  await db.delete(votes).where(and(eq(votes.userId, userId), eq(votes.itemId, itemId)))
}

export async function createItem(data: ItemInsert) {
  const [item] = await db.insert(items).values(data).returning()
  return item
}

export async function updateItem(id: string, data: Partial<Omit<ItemInsert, 'id' | 'createdAt'>>) {
  const [item] = await db
    .update(items)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(items.id, id))
    .returning()
  return item
}

export async function softDeleteItem(id: string) {
  await db.update(items).set({ deletedAt: new Date() }).where(eq(items.id, id))
}
