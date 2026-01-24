import { isTradingHoliday, isWeekend, getNextTradingDay } from './trading-holidays'

/**
 * Get the previous trading day (skips weekends and holidays)
 * This is used to determine which contest date to calculate results for
 */
export function getPreviousTradingDay(fromDate: Date = new Date()): Date {
    const date = new Date(fromDate)
    date.setHours(0, 0, 0, 0)

    // Go back one day
    date.setDate(date.getDate() - 1)

    // Keep going back until we find a trading day
    while (isWeekend(date) || isTradingHoliday(date)) {
        date.setDate(date.getDate() - 1)
    }

    return date
}

/**
 * Get the contest date that should be calculated
 * This is the previous trading day from today
 */
export function getContestDateForCalculation(): Date {
    return getPreviousTradingDay()
}

/**
 * Check if we should run result calculation now
 * Returns true if it's a trading day and we haven't calculated results yet
 */
export async function shouldCalculateResults(): Promise<boolean> {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Don't calculate on weekends or holidays
    if (isWeekend(today) || isTradingHoliday(today)) {
        return false
    }

    return true
}
