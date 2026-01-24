import { NextRequest, NextResponse } from 'next/server'
import { calculateResults } from '@/lib/calculate-results'
import { getContestDateForCalculation, shouldCalculateResults } from '@/lib/trading-calendar'

// Force dynamic rendering - this route uses request.headers
export const dynamic = 'force-dynamic'

/**
 * Automated cron endpoint for daily result calculation
 * Triggered by Vercel Cron at 4:00 PM IST (10:30 AM UTC) daily
 *  
 * This endpoint is protected by CRON_SECRET to ensure only Vercel can call it
 */
export async function GET(request: NextRequest) {
    try {
        // Verify the request is from Vercel Cron
        const authHeader = request.headers.get('authorization')
        const cronSecret = process.env.CRON_SECRET

        if (!cronSecret) {
            console.error('CRON_SECRET not configured')
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            )
        }

        // Check authorization header
        if (authHeader !== `Bearer ${cronSecret}`) {
            console.error('Unauthorized cron request')
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Check if we should calculate results today
        const shouldCalculate = await shouldCalculateResults()

        if (!shouldCalculate) {
            console.log('Skipping result calculation - market is closed today (weekend or holiday)')
            return NextResponse.json({
                success: true,
                message: 'Skipped - market closed today',
                skipped: true,
            })
        }

        // Get the contest date to calculate (previous trading day)
        const contestDate = getContestDateForCalculation()

        console.log(`Cron triggered: Calculating results for ${contestDate.toDateString()}`)

        // Run the calculation
        const result = await calculateResults(contestDate)

        if (!result.success) {
            console.error(`Failed to calculate results: ${result.error}`)
            return NextResponse.json(
                {
                    success: false,
                    error: result.error,
                    contestDate: contestDate.toISOString(),
                },
                { status: result.error === 'No predictions found for this date' ? 404 : 500 }
            )
        }

        console.log(`Results calculated successfully for ${contestDate.toDateString()}`)
        console.log(`Winner: ${result.winner}`)

        return NextResponse.json({
            success: true,
            ...result,
            contestDate: contestDate.toISOString(),
        })
    } catch (error) {
        console.error('Cron job error:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Internal server error',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        )
    }
}
