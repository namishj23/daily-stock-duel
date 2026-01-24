#!/usr/bin/env ts-node

/**
 * Test script for trading calendar utilities
 * Run with: npx ts-node scripts/test-trading-calendar.ts
 */

import { getPreviousTradingDay, getContestDateForCalculation } from '../src/lib/trading-calendar.js'
import { isWeekend, isTradingHoliday, getNextTradingDay } from '../src/lib/trading-holidays.js'

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

// Test 2: Skipping weekends
console.log('Test 2: Skipping Weekends')
console.log('==========================')
const monday = new Date('2026-01-26') // Monday (but Republic Day holiday!)
const prevFromMonday = getPreviousTradingDay(monday)
console.log(`From Monday (Jan 26): ${prevFromMonday.toDateString()}`)
console.log(`Expected: Should skip both weekend AND Republic Day holiday`)
console.log('')

// Test 3: Skipping holidays
console.log('Test 3: Skipping Holidays')
console.log('==========================')
const afterRepublicDay = new Date('2026-01-27') // Tuesday after Republic Day
const prevFromTue = getPreviousTradingDay(afterRepublicDay)
console.log(`From Tuesday (Jan 27): ${prevFromTue.toDateString()}`)
console.log(`Is holiday? ${isTradingHoliday(prevFromTue)}`)
console.log('')

// Test 4: getContestDateForCalculation()
console.log('Test 4: getContestDateForCalculation()')
console.log('=======================================')
const contestDate = getContestDateForCalculation()
console.log(`Contest Date for Calculation: ${contestDate.toDateString()}`)
console.log(`This is the date we should calculate results for`)
console.log('')

// Test 5: Test specific dates
console.log('Test 5: Specific Holiday Tests')
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

// Test 6: Next trading day
console.log('Test 6: Next Trading Day')
console.log('=========================')
const friday = new Date('2026-01-23') // Friday
const nextFromFriday = getNextTradingDay(friday)
console.log(`Next trading day from Friday (Jan 23): ${nextFromFriday.toDateString()}`)
console.log(`Expected: Monday Jan 26 is holiday, so should be Jan 27`)
console.log('')

console.log('✅ All tests completed!')
