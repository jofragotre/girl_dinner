'use client'

import { useTransition, useState } from 'react'
import { castVote } from '@/app/actions/votes'

interface VoteButtonsProps {
  itemId: string
  initialScore: number
  initialUserVote: number
  accent?: 'pink' | 'cyan'
}

export default function VoteButtons({
  itemId,
  initialScore,
  initialUserVote,
  accent = 'pink',
}: VoteButtonsProps) {
  const [score, setScore] = useState(Number(initialScore))
  const [userVote, setUserVote] = useState(Number(initialUserVote))
  const [isPending, startTransition] = useTransition()

  const accentColor = accent === 'cyan' ? '#5EEAD4' : '#FF3D8B'

  function handleVote(value: 1 | -1) {
    const prevScore = score
    const prevVote = userVote

    const newVote = userVote === value ? 0 : value
    const delta = newVote - userVote
    setScore(score + delta)
    setUserVote(newVote)

    startTransition(async () => {
      try {
        await castVote(itemId, value, userVote)
      } catch {
        setScore(prevScore)
        setUserVote(prevVote)
      }
    })
  }

  const upActive = userVote === 1
  const downActive = userVote === -1

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => handleVote(1)}
        disabled={isPending}
        className="flex items-center justify-center w-6 h-6 rounded-full transition-all cursor-pointer disabled:opacity-40"
        style={{
          background: upActive ? `${accentColor}22` : 'transparent',
          color: upActive ? accentColor : 'rgba(245,230,240,0.35)',
          border: `1px solid ${upActive ? accentColor : 'rgba(245,230,240,0.15)'}`,
        }}
        title="upvote"
      >
        <span className="text-[10px] leading-none">▲</span>
      </button>

      <span
        className="text-[11px] font-bold tabular-nums w-5 text-center"
        style={{ color: score > 0 ? accentColor : score < 0 ? '#888' : 'rgba(245,230,240,0.4)' }}
      >
        {score}
      </span>

      <button
        onClick={() => handleVote(-1)}
        disabled={isPending}
        className="flex items-center justify-center w-6 h-6 rounded-full transition-all cursor-pointer disabled:opacity-40"
        style={{
          background: downActive ? 'rgba(136,136,136,0.15)' : 'transparent',
          color: downActive ? '#aaa' : 'rgba(245,230,240,0.35)',
          border: `1px solid ${downActive ? '#666' : 'rgba(245,230,240,0.15)'}`,
        }}
        title="downvote"
      >
        <span className="text-[10px] leading-none">▼</span>
      </button>
    </div>
  )
}
