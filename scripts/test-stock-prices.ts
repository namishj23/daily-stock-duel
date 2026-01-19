// Test script for Yahoo Finance integration
// Run with: npx ts-node scripts/test-stock-prices.ts

import { fetchStockData, calculatePercentChange } from '../src/lib/stock-prices.js'

async function testStockPrices() {
    console.log('🧪 Testing Yahoo Finance Integration\n')

    // Test 1: Fetch current stock data
    console.log('Test 1: Fetching current RELIANCE stock data...')
    try {
        const relianceData = await fetchStockData('RELIANCE')
        console.log('✅ Success!')
        console.log('  Symbol:', relianceData.symbol)
        console.log('  Date:', relianceData.date.toDateString())
        console.log('  Open:', relianceData.open)
        console.log('  Close:', relianceData.close)
        console.log('  High:', relianceData.high)
        console.log('  Low:', relianceData.low)

        const change = calculatePercentChange(relianceData.open, relianceData.close)
        console.log('  % Change:', change.toFixed(2) + '%')
        console.log()
    } catch (error) {
        console.error('❌ Failed:', error)
    }

    // Test 2: Fetch historical data
    console.log('Test 2: Fetching historical TCS stock data for Jan 15, 2026...')
    try {
        const yesterday = new Date('2026-01-15')
        const tcsData = await fetchStockData('TCS', yesterday)
        console.log('✅ Success!')
        console.log('  Symbol:', tcsData.symbol)
        console.log('  Date:', tcsData.date.toDateString())
        console.log('  Open:', tcsData.open)
        console.log('  Close:', tcsData.close)

        const change = calculatePercentChange(tcsData.open, tcsData.close)
        console.log('  % Change:', change.toFixed(2) + '%')
        console.log()
    } catch (error) {
        console.error('❌ Failed:', error)
    }

    // Test 3: Fetch multiple stocks
    console.log('Test 3: Fetching multiple stocks (RELIANCE, TCS, INFY)...')
    try {
        const symbols = ['RELIANCE', 'TCS', 'INFY']
        for (const symbol of symbols) {
            const data = await fetchStockData(symbol)
            const change = calculatePercentChange(data.open, data.close)
            console.log(`  ${symbol}: ${change > 0 ? '+' : ''}${change.toFixed(2)}%`)
        }
        console.log('✅ Success!\n')
    } catch (error) {
        console.error('❌ Failed:', error)
    }

    console.log('🎉 Testing complete!')
}

testStockPrices().catch(console.error)
