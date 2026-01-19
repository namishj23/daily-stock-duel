// NSE/BSE Trading Holidays 2026
// Official holidays when equity, derivatives, and other segments will remain closed

export const TRADING_HOLIDAYS_2026 = [
    { date: '2026-01-15', name: 'Maharashtra Municipal Elections' },
    { date: '2026-01-26', name: 'Republic Day' },
    { date: '2026-03-03', name: 'Holi' },
    { date: '2026-03-26', name: 'Shri Ram Navami' },
    { date: '2026-03-31', name: 'Shri Mahavir Jayanti' },
    { date: '2026-04-03', name: 'Good Friday' },
    { date: '2026-04-14', name: 'Dr. Baba Saheb Ambedkar Jayanti' },
    { date: '2026-05-01', name: 'Maharashtra Day' },
    { date: '2026-05-28', name: 'Bakri Id' },
    { date: '2026-06-26', name: 'Muharram' },
    { date: '2026-09-14', name: 'Ganesh Chaturthi' },
    { date: '2026-10-02', name: 'Mahatma Gandhi Jayanti' },
    { date: '2026-10-20', name: 'Dussehra' },
    { date: '2026-11-10', name: 'Diwali - Balipratipada' },
    { date: '2026-11-24', name: 'Prakash Gurpurb Sri Guru Nanak Dev' },
    { date: '2026-12-25', name: 'Christmas' },
] as const

// Special Muhurat trading session (not a full holiday)
export const MUHURAT_TRADING_2026 = {
    date: '2026-11-08',
    name: 'Diwali Laxmi Pujan - Muhurat Trading',
    note: 'Special trading session with limited hours'
} as const

/**
 * Check if a given date is a trading holiday
 * @param date Date object to check
 * @returns boolean indicating if market is closed
 */
export function isTradingHoliday(date: Date): boolean {
    const dateStr = formatDateToISO(date)
    return TRADING_HOLIDAYS_2026.some(holiday => holiday.date === dateStr)
}

/**
 * Check if a given date is a weekend (Saturday/Sunday)
 * @param date Date object to check
 * @returns boolean indicating if it's a weekend
 */
export function isWeekend(date: Date): boolean {
    const day = date.getDay()
    return day === 0 || day === 6 // Sunday = 0, Saturday = 6
}

/**
 * Check if market is open on a given date
 * @param date Date object to check
 * @returns boolean indicating if market is open
 */
export function isMarketOpen(date: Date): boolean {
    return !isWeekend(date) && !isTradingHoliday(date)
}

/**
 * Get the holiday name for a given date
 * @param date Date object to check
 * @returns Holiday name or null
 */
export function getHolidayName(date: Date): string | null {
    const dateStr = formatDateToISO(date)
    const holiday = TRADING_HOLIDAYS_2026.find(h => h.date === dateStr)
    return holiday?.name || null
}

/**
 * Format date to ISO string (YYYY-MM-DD)
 * @param date Date object
 * @returns Formatted date string
 */
function formatDateToISO(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

/**
 * Get next trading day from a given date
 * @param date Starting date
 * @returns Next market open date
 */
export function getNextTradingDay(date: Date): Date {
    const nextDay = new Date(date)
    nextDay.setDate(nextDay.getDate() + 1)

    // Keep advancing until we find a trading day
    while (!isMarketOpen(nextDay)) {
        nextDay.setDate(nextDay.getDate() + 1)
    }

    return nextDay
}
