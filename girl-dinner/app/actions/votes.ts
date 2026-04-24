'use server'

import { auth } from '@clerk/nextjs/server'
import { upsertVote, clearVote } from '@/db/queries'
import { revalidatePath } from 'next/cache'

export async function castVote(itemId: string, value: 1 | -1, currentVote: number) {
  const { userId } = await auth()
  if (!userId) throw new Error('Not signed in')

  if (currentVote === value) {
    await clearVote(userId, itemId)
  } else {
    await upsertVote(userId, itemId, value)
  }

  revalidatePath('/dishes')
  revalidatePath('/cocktails')
}
