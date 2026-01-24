import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { fetchStockData, calculatePercentChange } from '@/lib/stock-prices'

/**
 * Core logic for calculating results for a contest date
 * This is used by both the admin manual trigger and the automated cron job
 */
export async function calculateResults(contestDate: Date) {
    const date = new Date(contestDate)
    date.setHours(0, 0, 0, 0)

    // Fetch all predictions for this contest date
    const predictions = await prisma.dailyPrediction.findMany({
        where: {
            contestDate: date,
        },
        include: {
            stock: true,
            user: true,
        },
    })

    if (predictions.length === 0) {
        return {
            success: false,
            error: 'No predictions found for this date',
            processedCount: 0,
        }
    }

    console.log(`Processing ${predictions.length} predictions for ${date.toDateString()}`)

    // Group predictions by stock to batch fetch prices
    const stockSymbols = [...new Set(predictions.map(p => p.stock.symbol))]
    const stockDataMap = new Map()

    // Fetch stock prices for all unique stocks
    for (const symbol of stockSymbols) {
        try {
            const data = await fetchStockData(symbol, date)
            stockDataMap.set(symbol, data)
            console.log(`Fetched ${symbol}: Open=${data.open}, Close=${data.close}`)
        } catch (error) {
            console.error(`Failed to fetch ${symbol}:`, error)
        }
    }

    // Update each prediction with actual prices and calculate accuracy
    const updates = []
    for (const prediction of predictions) {
        const stockData = stockDataMap.get(prediction.stock.symbol)

        if (!stockData) {
            console.warn(`No stock data available for ${prediction.stock.symbol}`)
            continue
        }

        const actualChange = calculatePercentChange(stockData.open, stockData.close)

        updates.push(
            prisma.dailyPrediction.update({
                where: { id: prediction.id },
                data: {
                    entryPrice: stockData.open,
                    exitPrice: stockData.close,
                    percentChange: actualChange,
                },
            })
        )
    }

    await Promise.all(updates)

    // Find the most accurate prediction (closest to actual percentage)
    const updatedPredictions = await prisma.dailyPrediction.findMany({
        where: {
            contestDate: date,
            percentChange: { not: null },
        },
        include: {
            stock: true,
            user: true,
        },
    })

    if (updatedPredictions.length === 0) {
        return {
            success: false,
            error: 'Stock prices updated but no complete predictions',
            processedCount: updates.length,
        }
    }

    // Calculate accuracy for each prediction
    let mostAccuratePrediction = updatedPredictions[0]
    let smallestError = Math.abs((mostAccuratePrediction.percentChange || 0) - mostAccuratePrediction.predictedChange)

    for (const pred of updatedPredictions) {
        const error = Math.abs((pred.percentChange || 0) - pred.predictedChange)
        if (error < smallestError) {
            smallestError = error
            mostAccuratePrediction = pred
        } else if (error === smallestError) {
            // Tie-breaker: earliest submission
            if (pred.submittedAt < mostAccuratePrediction.submittedAt) {
                mostAccuratePrediction = pred
            }
        }
    }

    // Check if daily result already exists
    const existingResult = await prisma.dailyResult.findUnique({
        where: { contestDate: date },
    })

    if (existingResult) {
        return {
            success: true,
            message: 'Results already calculated for this date',
            winner: mostAccuratePrediction.user.name,
            accuracy: smallestError.toFixed(2) + '% error',
            processedCount: updates.length,
            alreadyCalculated: true,
        }
    }

    // Create daily result
    const dailyResult = await prisma.dailyResult.create({
        data: {
            contestDate: date,
            winnerUserId: mostAccuratePrediction.userId,
            predictionId: mostAccuratePrediction.id,
            percentGain: mostAccuratePrediction.percentChange || 0,
        },
    })

    return {
        success: true,
        message: 'Results calculated successfully',
        winner: mostAccuratePrediction.user.name,
        winnerPrediction: {
            stock: mostAccuratePrediction.stock.symbol,
            predicted: mostAccuratePrediction.predictedChange,
            actual: mostAccuratePrediction.percentChange,
            accuracy: smallestError.toFixed(2) + '% error',
        },
        processedCount: updates.length,
        dailyResult,
        alreadyCalculated: false,
    }
}

// POST - Calculate results for a specific contest date (Admin only)
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        // Only admins can trigger result calculation
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
        })

        if (user?.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Only admins can calculate results' },
                { status: 403 }
            )
        }

        const { contestDate } = await request.json()

        if (!contestDate) {
            return NextResponse.json(
                { error: 'Contest date is required' },
                { status: 400 }
            )
        }

        const result = await calculateResults(new Date(contestDate))

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 404 }
            )
        }

        return NextResponse.json(result)
    } catch (error) {
        console.error('Error calculating results:', error)
        return NextResponse.json(
            { error: 'Failed to calculate results' },
            { status: 500 }
        )
    }
}

// GET - Get results for a specific contest date
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const contestDate = searchParams.get('date')

        if (!contestDate) {
            return NextResponse.json(
                { error: 'Contest date parameter is required' },
                { status: 400 }
            )
        }

        const date = new Date(contestDate)

        const result = await prisma.dailyResult.findUnique({
            where: { contestDate: date },
            include: {
                winner: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
                prediction: {
                    include: {
                        stock: true,
                    },
                },
            },
        })

        if (!result) {
            return NextResponse.json(
                { error: 'No results found for this date' },
                { status: 404 }
            )
        }

        return NextResponse.json({ result })
    } catch (error) {
        console.error('Error fetching results:', error)
        return NextResponse.json(
            { error: 'Failed to fetch results' },
            { status: 500 }
        )
    }
}
