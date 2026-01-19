import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CONTEST_TIMING } from '@/lib/constants'
import { isMarketOpen, getHolidayName, getNextTradingDay } from '@/lib/trading-holidays'

function isWithinSubmissionWindow(): boolean {
    // Time constraint removed - predictions allowed anytime
    return true

    // Original time constraint code (commented for future reference):
    // const now = new Date()
    // const istOffset = 5.5 * 60 * 60 * 1000
    // const istTime = new Date(now.getTime() + istOffset)
    // const hours = istTime.getUTCHours()
    // const minutes = istTime.getUTCMinutes()
    // const currentTime = hours * 60 + minutes
    // const startTime = CONTEST_TIMING.SUBMISSION_START.hour * 60 + CONTEST_TIMING.SUBMISSION_START.minute
    // const endTime = CONTEST_TIMING.SUBMISSION_END.hour * 60 + CONTEST_TIMING.SUBMISSION_END.minute
    // return currentTime >= startTime && currentTime <= endTime
}

function getContestDate(): Date {
    const now = new Date()
    // Convert to IST (UTC+5:30)
    const istOffset = 5.5 * 60 * 60 * 1000
    const istTime = new Date(now.getTime() + istOffset)

    const hours = istTime.getUTCHours()
    const minutes = istTime.getUTCMinutes()

    // If before 8:30 AM IST, prediction is for today's market
    // If after 8:30 AM IST, prediction is for tomorrow's market
    let contestDate = new Date(istTime)
    if (hours > 8 || (hours === 8 && minutes >= 30)) {
        // After 8:30 AM - predict for tomorrow
        contestDate.setUTCDate(contestDate.getUTCDate() + 1)
    }

    // Set to start of day
    contestDate.setUTCHours(0, 0, 0, 0)

    // Check if this is a trading day (skip weekends/holidays)
    // Convert to IST for holiday check
    const checkDate = new Date(contestDate.getTime() + istOffset)
    if (!isMarketOpen(checkDate)) {
        // Find next trading day
        contestDate = getNextTradingDay(checkDate)
        contestDate.setUTCHours(0, 0, 0, 0)
        // Convert back to UTC
        return new Date(contestDate.getTime() - istOffset)
    }

    // Convert back to UTC
    return new Date(contestDate.getTime() - istOffset)
}

// GET - Get user's prediction for today
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const contestDate = getContestDate()

        const prediction = await prisma.dailyPrediction.findUnique({
            where: {
                userId_contestDate: {
                    userId: session.user.id,
                    contestDate,
                },
            },
            include: {
                stock: {
                    select: {
                        symbol: true,
                        name: true,
                    },
                },
            },
        })

        return NextResponse.json({ prediction })
    } catch (error) {
        console.error('Error fetching prediction:', error)
        return NextResponse.json(
            { error: 'Failed to fetch prediction' },
            { status: 500 }
        )
    }
}

// POST - Submit a new prediction
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized. Please sign in to make a prediction.' },
                { status: 401 }
            )
        }

        // Check submission window
        if (!isWithinSubmissionWindow()) {
            return NextResponse.json(
                { error: 'Predictions are only accepted between 9:00 AM and 10:00 AM IST' },
                { status: 400 }
            )
        }

        const { stockId, predictedChange } = await request.json()

        // Validate input
        if (!stockId || predictedChange === undefined || predictedChange === null) {
            return NextResponse.json(
                { error: 'Stock and predicted change are required' },
                { status: 400 }
            )
        }

        // Validate predicted change is within range
        if (typeof predictedChange !== 'number' || predictedChange < -20 || predictedChange > 20) {
            return NextResponse.json(
                { error: 'Predicted change must be between -20% and +20%' },
                { status: 400 }
            )
        }

        // Predicted change cannot be 0
        if (predictedChange === 0) {
            return NextResponse.json(
                { error: 'Please select a prediction other than 0%' },
                { status: 400 }
            )
        }

        // Check if stock exists and is active
        const stock = await prisma.stock.findUnique({
            where: { id: stockId },
        })

        if (!stock || !stock.isActive) {
            return NextResponse.json(
                { error: 'Invalid or inactive stock selected' },
                { status: 400 }
            )
        }

        // Check if user has age confirmed
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
        })

        if (!user?.ageConfirmed) {
            return NextResponse.json(
                { error: 'Please confirm you are 18+ years old' },
                { status: 400 }
            )
        }

        const contestDate = getContestDate()

        // Use upsert to allow users to update their prediction within the window
        const prediction = await prisma.dailyPrediction.upsert({
            where: {
                userId_contestDate: {
                    userId: session.user.id,
                    contestDate,
                },
            },
            update: {
                stockId,
                predictedChange,
                lockedAt: new Date(), // Update timestamp when prediction is changed
            },
            create: {
                userId: session.user.id,
                stockId,
                predictedChange,
                contestDate,
                lockedAt: new Date(),
            },
            include: {
                stock: {
                    select: {
                        symbol: true,
                        name: true,
                    },
                },
            },
        })

        return NextResponse.json({
            message: 'Prediction submitted successfully',
            prediction,
            isUpdate: true, // Let frontend know if this was an update
        })
    } catch (error) {
        console.error('Error submitting prediction:', error)
        return NextResponse.json(
            { error: 'Failed to submit prediction' },
            { status: 500 }
        )
    }
}
