'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { LeaderboardTable } from '@/components/leaderboard/LeaderboardTable'
import { Trophy, Calendar } from 'lucide-react'

export default function LeaderboardPage() {
    const today = new Date().toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

    return (
        <div className="min-h-screen">
            <Header />
            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        {/* Page Header */}
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 mb-4">
                                <Trophy className="w-4 h-4 text-secondary" />
                                <span className="text-sm font-medium">Daily Rankings</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">
                                <span className="text-gradient">Leaderboard</span>
                            </h1>
                            <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                <span>{today}</span>
                            </div>
                        </div>

                        {/* Leaderboard Table - Shows top 10 + personal rank */}
                        <LeaderboardTable />

                        {/* Info Note */}
                        <div className="mt-8 p-4 rounded-xl bg-accent/50 border border-border/50 text-center text-sm text-muted-foreground">
                            <p>
                                Rankings are updated after market close at 3:30 PM IST.
                                Final winner announced at 4:00 PM IST.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
