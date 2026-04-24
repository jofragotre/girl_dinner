import { pgTable, text, jsonb, timestamp, smallint, primaryKey } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

export const items = pgTable('items', {
  id: text('id').primaryKey(),
  kind: text('kind', { enum: ['recipe', 'cocktail'] }).notNull(),
  name: text('name').notNull(),
  vibe: text('vibe'),
  ingredients: jsonb('ingredients').notNull().$type<string[]>(),
  moods: text('moods').array().notNull().default(sql`ARRAY[]::text[]`),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
})

export const votes = pgTable('votes', {
  userId: text('user_id').notNull(),
  itemId: text('item_id').notNull().references(() => items.id, { onDelete: 'cascade' }),
  value: smallint('value').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  primaryKey({ columns: [table.userId, table.itemId] }),
])

export type Item = typeof items.$inferSelect
export type ItemInsert = typeof items.$inferInsert
