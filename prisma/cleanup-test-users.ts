import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🗑️  Starting cleanup of test users...')

    // Get count before deletion
    const userCount = await prisma.user.count({
        where: { email: { contains: 'testuser' } }
    })

    const predictionCount = await prisma.dailyPrediction.count({
        where: {
            user: { email: { contains: 'testuser' } }
        }
    })

    console.log(`Found ${userCount} test users with ${predictionCount} predictions`)

    // Delete predictions first (due to foreign key constraints)
    const deletedPredictions = await prisma.dailyPrediction.deleteMany({
        where: {
            user: { email: { contains: 'testuser' } }
        }
    })

    console.log(`✓ Deleted ${deletedPredictions.count} test predictions`)

    // Delete test users
    const deletedUsers = await prisma.user.deleteMany({
        where: { email: { contains: 'testuser' } }
    })

    console.log(`✓ Deleted ${deletedUsers.count} test users`)
    console.log('\n🎉 Cleanup completed successfully!')
}

main()
    .catch((e) => {
        console.error('❌ Error cleaning up test users:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
