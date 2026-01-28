// Script to create test predictions with popular NSE stocks that work with Yahoo Finance
// Run with: npx tsx prisma/seed/seed-predictions.ts

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Popular NSE stocks that work with Yahoo Finance
const POPULAR_STOCKS = [
    { symbol: 'RELIANCE', name: 'Reliance Industries Ltd' },
    { symbol: 'TCS', name: 'Tata Consultancy Services' },
    { symbol: 'INFY', name: 'Infosys Ltd' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd' },
]

async function main() {
    console.log('🌱 Seeding test predictions...')

    // Contest date for testing (Jan 27, 2026)
    const contestDate = new Date('2026-01-27T00:00:00.000Z')
    console.log('Contest Date:', contestDate.toISOString())

    // Get all users
    const users = await prisma.user.findMany({ take: 5 })
    if (users.length === 0) {
        console.log('❌ No users found. Please create at least one user first.')
        return
    }
    console.log(`Found ${users.length} users`)

    // Ensure popular stocks exist in database
    console.log('Creating/updating popular stocks...')
    const stocks = []
    for (const stockData of POPULAR_STOCKS) {
        const stock = await prisma.stock.upsert({
            where: { symbol: stockData.symbol },
            update: { isActive: true },
            create: {
                symbol: stockData.symbol,
                name: stockData.name,
                isActive: true,
            }
        })
        stocks.push(stock)
    }
    console.log(`Ensured ${stocks.length} popular stocks exist`)

    // Delete existing predictions for this contest date
    await prisma.dailyPrediction.deleteMany({
        where: { contestDate: contestDate }
    })
    console.log('Cleared existing predictions for this date')

    // Delete any existing daily result for this date
    await prisma.dailyResult.deleteMany({
        where: { contestDate: contestDate }
    })
    console.log('Cleared existing daily result for this date')

    // Create predictions for each user
    const predictions = []
    for (let i = 0; i < users.length; i++) {
        const user = users[i]
        const stock = stocks[i % stocks.length]

        // Random predicted change between -3 and +3
        const predictedChange = parseFloat((Math.random() * 6 - 3).toFixed(2))

        const prediction = await prisma.dailyPrediction.create({
            data: {
                userId: user.id,
                stockId: stock.id,
                predictedChange: predictedChange,
                contestDate: contestDate,
                lockedAt: new Date(),
                submittedAt: new Date(Date.now() - Math.random() * 3600000),
            }
        })

        predictions.push({
            user: user.name || user.email,
            stock: stock.symbol,
            predicted: predictedChange.toFixed(2) + '%'
        })
    }

    console.log('\n✅ Created predictions:')
    console.table(predictions)

    console.log('\n🕓 The cron job runs automatically at 4:00 PM IST.')
    console.log('📊 Or manually trigger with:')
    console.log('   curl -X GET "https://stockprediction1.vercel.app/api/cron/calculate-results" -H "Authorization: Bearer YOUR_CRON_SECRET"')
}

main()
    .catch((e) => {
        console.error('Error:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
