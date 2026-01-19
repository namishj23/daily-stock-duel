import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const stocks = await prisma.stock.findMany({
            where: { isActive: true },
            orderBy: { symbol: 'asc' },
            select: {
                id: true,
                symbol: true,
                name: true,
            },
        })

        return NextResponse.json(stocks)
    } catch (error) {
        console.error('Error fetching stocks:', error)
        return NextResponse.json(
            { error: 'Failed to fetch stocks' },
            { status: 500 }
        )
    }
}
