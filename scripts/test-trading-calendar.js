/**
 * Simple test script for trading calendar utilities
 * Run with: npm run dev (then manually call the functions)
 */

const { getPreviousTradingDay, getContestDateForCalculation } = require('../src/lib/trading-calendar.ts')
const { isWeekend, isTradingHoliday, getNextTradingDay } = require('../src/lib/trading-holidays.ts')

console.log('🧪 Testing Trading Calendar Utilities\n')

// Test 1: getPreviousTradingDay()
console.log('Test 1: getPreviousTradingDay()')
console.log('================================')
const today = new Date()
const previousTradingDay = getPreviousTradingDay(today)
console.log(`Today: ${today.toDateString()}`)
console.log(`Previous Trading Day: ${previousTradingDay.toDateString()}`)
console.log(`Is weekend? ${isWeekend(previousTradingDay)}`)
console.log(`Is holiday? ${isTradingHoliday(previousTradingDay)}`)
console.log('')

// Test 2: getContestDateForCalculation()
console.log('Test 2: getContestDateForCalculation()')
console.log('=======================================')
const contestDate = getContestDateForCalculation()
console.log(`Contest Date for Calculation: ${contestDate.toDateString()}`)
console.log(`This is the date we should calculate results for`)
console.log('')

// Test 3: Check specific holidays
console.log('Test 3: Specific Holiday Tests')
console.log('================================')
const testDates = [
    new Date('2026-01-26'), // Republic Day
    new Date('2026-03-03'), // Holi
    new Date('2026-04-03'), // Good Friday
    new Date('2026-12-25'), // Christmas
]

testDates.forEach(date => {
    console.log(`${date.toDateString()}: Holiday? ${isTradingHoliday(date)} | Weekend? ${isWeekend(date)}`)
})
console.log('')

console.log('✅ All tests completed!')
