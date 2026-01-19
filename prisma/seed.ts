import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting database seed...')

    // Clear existing data
    console.log('🗑️  Clearing existing predictions...')
    await prisma.dailyPrediction.deleteMany()
    console.log('🗑️  Clearing existing users...')
    await prisma.user.deleteMany({ where: { email: { contains: 'testuser' } } })

    // Get or create stocks
    console.log('📈 Checking stocks...')
    let stocks = await prisma.stock.findMany({ where: { isActive: true } })

    if (stocks.length === 0) {
        console.log('📈 Creating sample stocks...')
        const stockData = [
            { symbol: 'RELIANCE', name: 'Reliance Industries Ltd' },
            { symbol: 'TCS', name: 'Tata Consultancy Services Ltd' },
            { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd' },
            { symbol: 'INFY', name: 'Infosys Ltd' },
            { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd' },
            { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd' },
            { symbol: 'ITC', name: 'ITC Ltd' },
            { symbol: 'SBIN', name: 'State Bank of India' },
            { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd' },
            { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank Ltd' },
        ]

        for (const stock of stockData) {
            await prisma.stock.create({ data: stock })
        }

        stocks = await prisma.stock.findMany({ where: { isActive: true } })
    }

    console.log(`✅ Found ${stocks.length} active stocks`)

    // Generate names for variety
    const firstNames = ['Raj', 'Priya', 'Amit', 'Sneha', 'Arjun', 'Kavya', 'Vikram', 'Ananya', 'Rohan', 'Diya']
    const lastNames = ['Sharma', 'Patel', 'Kumar', 'Singh', 'Reddy', 'Gupta', 'Mehta', 'Verma', 'Joshi', 'Nair']

    // Get today's contest date
    const contestDate = new Date()
    contestDate.setHours(0, 0, 0, 0)

    console.log('👥 Creating 100 users with predictions...')

    for (let i = 1; i <= 100; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
        const name = `${firstName} ${lastName}`
        const email = `testuser${i}@example.com`

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                ageConfirmed: true,
            },
        })

        // Create prediction for this user
        const randomStock = stocks[Math.floor(Math.random() * stocks.length)]

        // Generate random prediction between -20 and +20, excluding 0
        let predictedChange = Math.floor(Math.random() * 41) - 20 // -20 to +20
        if (predictedChange === 0) {
            predictedChange = Math.random() > 0.5 ? 1 : -1
        }

        await prisma.dailyPrediction.create({
            data: {
                userId: user.id,
                stockId: randomStock.id,
                predictedChange,
                contestDate,
                lockedAt: new Date(),
            },
        })

        if (i % 10 === 0) {
            console.log(`  ✓ Created ${i}/100 users with predictions`)
        }
    }

    console.log('✅ Successfully created 100 users with 100 predictions!')
    console.log('\n📊 Summary:')

    const userCount = await prisma.user.count({ where: { email: { contains: 'testuser' } } })
    const predictionCount = await prisma.dailyPrediction.count({ where: { contestDate } })

    console.log(`  - Total test users: ${userCount}`)
    console.log(`  - Total predictions for today: ${predictionCount}`)
    console.log(`  - Active stocks: ${stocks.length}`)

    console.log('\n🎉 Seed completed successfully!')
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
