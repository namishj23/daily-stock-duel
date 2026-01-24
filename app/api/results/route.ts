import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { calculateResults } from '@/lib/calculate-results'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// POST - Calculate results for a specific contest date (Admin only)
export async function POST(request: NextRequest): Promise<NextResponse> {
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
export async function GET(request: NextRequest): Promise<NextResponse> {
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
