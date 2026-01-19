'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Trophy, TrendingUp, TrendingDown, Crown, Medal } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LeaderboardEntry {
  rank: number
  userId: string
  name: string
  image?: string
  stock: string
  direction: 'UP' | 'DOWN'
  percentChange: number | null
  submittedAt: string
}

interface PersonalRank {
  rank: number | null
  stock: string
  direction: 'UP' | 'DOWN'
  percentChange: number | null
  isCorrect: boolean | null
  submittedAt: string
}

function getRankIcon(rank: number) {
  switch (rank) {
    case 1:
      return <Crown className="w-5 h-5 text-secondary" />
    case 2:
      return <Medal className="w-5 h-5 text-gray-400" />
    case 3:
      return <Medal className="w-5 h-5 text-amber-600" />
    default:
      return <span className="text-muted-foreground font-mono">{rank}</span>
  }
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function LeaderboardTable() {
  const { data: session } = useSession()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [personalRank, setPersonalRank] = useState<PersonalRank | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await fetch('/api/leaderboard')
        if (res.ok) {
          const data = await res.json()
          setLeaderboard(data.leaderboard || [])
          setPersonalRank(data.personalRank || null)
        }
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchLeaderboard()
  }, [])

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-card border border-border/50 p-8 text-center">
        <div className="animate-pulse">Loading leaderboard...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Personal Rank Card */}
      {session?.user && personalRank && (
        <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Your Position
          </h3>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold mono">
                {personalRank.rank ? `#${personalRank.rank}` : '-'}
              </div>
              <div className="text-xs text-muted-foreground">Rank</div>
            </div>
            <div>
              <div className="text-xl font-bold mono">{personalRank.stock}</div>
              <div className="text-xs text-muted-foreground">Stock</div>
            </div>
            <div>
              <div className={cn(
                'text-xl font-bold',
                personalRank.direction === 'UP' ? 'text-success' : 'text-destructive'
              )}>
                {personalRank.direction}
              </div>
              <div className="text-xs text-muted-foreground">Direction</div>
            </div>
            <div>
              <div className={cn(
                'text-xl font-bold mono',
                personalRank.isCorrect ? 'text-success' : 'text-muted-foreground'
              )}>
                {personalRank.percentChange !== null
                  ? `${personalRank.percentChange > 0 ? '+' : ''}${personalRank.percentChange.toFixed(2)}%`
                  : 'Pending'
                }
              </div>
              <div className="text-xs text-muted-foreground">% Change</div>
            </div>
          </div>
        </div>
      )}

      {/* Top 10 Leaderboard */}
      <div className="rounded-2xl bg-card border border-border/50 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-secondary" />
            <div>
              <h3 className="font-semibold text-lg">Top 10 Leaderboard</h3>
              <p className="text-sm text-muted-foreground">Updated at market close</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Prize Pool</div>
            <div className="text-xl font-bold text-gradient-gold mono">₹500</div>
          </div>
        </div>

        {/* Table */}
        {leaderboard.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-muted-foreground border-b border-border/50">
                  <th className="px-6 py-4 font-medium">Rank</th>
                  <th className="px-6 py-4 font-medium">Trader</th>
                  <th className="px-6 py-4 font-medium">Stock</th>
                  <th className="px-6 py-4 font-medium">Direction</th>
                  <th className="px-6 py-4 font-medium text-right">% Change</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry) => (
                  <tr
                    key={`${entry.userId}-${entry.rank}`}
                    className={cn(
                      'border-b border-border/30 transition-colors hover:bg-accent/50',
                      entry.rank === 1 && 'winner-glow bg-secondary/5'
                    )}
                  >
                    <td className="px-6 py-4">
                      <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                        {getRankIcon(entry.rank)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center font-medium text-sm">
                          {entry.image ? (
                            <img src={entry.image} alt="" className="w-10 h-10 rounded-full" />
                          ) : (
                            getInitials(entry.name)
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{entry.name}</div>
                          <div className="text-xs text-muted-foreground">
                            Submitted {new Date(entry.submittedAt).toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true
                            })}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono font-medium">{entry.stock}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
                        entry.direction === 'UP' ? 'badge-up' : 'badge-down'
                      )}>
                        {entry.direction === 'UP' ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {entry.direction}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={cn(
                        'font-mono font-medium',
                        entry.percentChange && entry.percentChange > 0 ? 'text-success' : 'text-warning'
                      )}>
                        {entry.percentChange !== null
                          ? `+${entry.percentChange.toFixed(2)}%`
                          : '-'
                        }
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            <p>No results available yet.</p>
            <p className="text-sm mt-2">Results will appear after market close at 3:30 PM IST.</p>
          </div>
        )}
      </div>
    </div>
  )
}
