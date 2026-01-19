import yahooFinance from 'yahoo-finance2'

/**
 * Fetch stock data from Yahoo Finance for NSE stocks
 * @param symbol Stock symbol (e.g., "RELIANCE")
 * @param date Optional date for historical data (defaults to today)
 * @returns Stock price data
 */
export async function fetchStockData(symbol: string, date?: Date) {
    try {
        // NSE stocks need .NS suffix for Yahoo Finance
        const yahooSymbol = `${symbol}.NS`

        if (date) {
            // Fetch historical data for a specific date
            const endDate = new Date(date)
            endDate.setDate(endDate.getDate() + 1) // Yahoo Finance needs exclusive end date

            const startDate = new Date(date)
            startDate.setDate(startDate.getDate() - 1) // Start from day before to ensure we get the date

            const result = await yahooFinance.historical(yahooSymbol, {
                period1: startDate,
                period2: endDate,
                interval: '1d' as const,
            }) as any[]

            if (!result || result.length === 0) {
                throw new Error(`No data found for ${symbol} on ${date.toDateString()}`)
            }

            // Find the exact date in results
            const stockData = result.find((item: any) => {
                const itemDate = new Date(item.date)
                return itemDate.toDateString() === date.toDateString()
            })

            if (!stockData) {
                throw new Error(`No data found for ${symbol} on ${date.toDateString()}`)
            }

            return {
                symbol,
                date,
                open: stockData.open || 0,
                close: stockData.close || 0,
                high: stockData.high || 0,
                low: stockData.low || 0,
                volume: stockData.volume || 0,
            }
        } else {
            // Fetch current/latest quote
            const quote = await yahooFinance.quote(yahooSymbol) as any

            return {
                symbol,
                date: new Date(quote.regularMarketTime || new Date()),
                open: quote.regularMarketOpen || 0,
                close: quote.regularMarketPrice || 0,
                high: quote.regularMarketDayHigh || 0,
                low: quote.regularMarketDayLow || 0,
                volume: quote.regularMarketVolume || 0,
            }
        }
    } catch (error) {
        console.error(`Error fetching stock data for ${symbol}:`, error)
        throw new Error(`Failed to fetch stock data for ${symbol}`)
    }
}

/**
 * Calculate percentage change between open and close
 * @param open Opening price
 * @param close Closing price
 * @returns Percentage change
 */
export function calculatePercentChange(open: number, close: number): number {
    if (!open || open === 0) {
        throw new Error('Invalid opening price')
    }
    return ((close - open) / open) * 100
}

/**
 * Batch fetch stock data for multiple symbols
 * @param symbols Array of stock symbols
 * @param date Optional date for historical data
 * @returns Array of stock data
 */
export async function batchFetchStockData(symbols: string[], date?: Date) {
    const results = await Promise.allSettled(
        symbols.map(symbol => fetchStockData(symbol, date))
    )

    return results.map((result, index) => {
        if (result.status === 'fulfilled') {
            return result.value
        } else {
            console.error(`Failed to fetch ${symbols[index]}:`, result.reason)
            return null
        }
    }).filter((item): item is NonNullable<typeof item> => item !== null)
}

/**
 * Check if stock data is available for a given date
 * Useful for checking if market was open on that day
 * @param symbol Stock symbol
 * @param date Date to check
 * @returns boolean indicating if data is available
 */
export async function isStockDataAvailable(symbol: string, date: Date): Promise<boolean> {
    try {
        await fetchStockData(symbol, date)
        return true
    } catch {
        return false
    }
}
