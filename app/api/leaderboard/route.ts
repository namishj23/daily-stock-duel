import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function getContestDate(): Date {
    const now = new Date()
    const istOffset = 5.5 * 60 * 60 * 1000
    const istTime = new Date(now.getTime() + istOffset)
    istTime.setUTCHours(0, 0, 0, 0)
    return new Date(istTime.getTime() - istOffset)
}

// GET - Get top 10 leaderboard + user's personal rank
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        const contestDate = getContestDate()

        // Get top 10 predictions with results (only after evaluation)
        const topPredictions = await prisma.dailyPrediction.findMany({
            where: {
                contestDate,
                isCorrect: true,
                percentChange: { not: null },
            },
            orderBy: [
                { percentChange: 'desc' },
                { submittedAt: 'asc' },
            ],
            take: 10,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
                stock: {
                    select: {
                        symbol: true,
                    },
                },
            },
        })

        // Transform to leaderboard format
        const leaderboard = topPredictions.map((pred, index) => ({
            rank: index + 1,
            userId: pred.user.id,
            name: pred.user.name || 'Anonymous',
            image: pred.user.image,
            stock: pred.stock.symbol,
            direction: pred.direction,
            percentChange: pred.percentChange,
            submittedAt: pred.submittedAt.toISOString(),
        }))

        // Get user's personal rank if logged in
        let personalRank = null
        if (session?.user?.id) {
            const userPrediction = await prisma.dailyPrediction.findUnique({
                where: {
                    userId_contestDate: {
                        userId: session.user.id,
                        contestDate,
                    },
                },
                include: {
                    stock: {
                        select: { symbol: true },
                    },
                },
            })

            if (userPrediction) {
                // Count how many correct predictions with higher % change exist
                const higherRanked = await prisma.dailyPrediction.count({
                    where: {
                        contestDate,
                        isCorrect: true,
                        percentChange: { not: null },
                        OR: [
                            { percentChange: { gt: userPrediction.percentChange || 0 } },
                            {
                                percentChange: userPrediction.percentChange,
                                submittedAt: { lt: userPrediction.submittedAt },
                            },
                        ],
                    },
                })

                personalRank = {
                    rank: userPrediction.isCorrect ? higherRanked + 1 : null,
                    stock: userPrediction.stock.symbol,
                    direction: userPrediction.direction,
                    percentChange: userPrediction.percentChange,
                    isCorrect: userPrediction.isCorrect,
                    submittedAt: userPrediction.submittedAt.toISOString(),
                }
            }
        }

        return NextResponse.json({
            leaderboard,
            personalRank,
            contestDate: contestDate.toISOString(),
        })
    } catch (error) {
        console.error('Error fetching leaderboard:', error)
        return NextResponse.json(
            { error: 'Failed to fetch leaderboard' },
            { status: 500 }
        )
    }
}
