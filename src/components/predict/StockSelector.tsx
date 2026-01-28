'use client'

import { useState, useEffect, useMemo } from 'react'
import { Check, ChevronsUpDown, Search, TrendingUp, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface Stock {
  id: string
  symbol: string
  name: string
}

interface StockSelectorProps {
  value: string
  onChange: (value: string, stockId: string) => void
}

// Popular stocks and ETFs to show at top when no search
const POPULAR_SYMBOLS = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'SBIN', 'NIFTYBEES', 'BANKBEES', 'GOLDBEES']

export function StockSelector({ value, onChange }: StockSelectorProps) {
  const [open, setOpen] = useState(false)
  const [stocks, setStocks] = useState<Stock[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    async function fetchStocks() {
      try {
        const res = await fetch('/api/stocks')
        if (res.ok) {
          const data = await res.json()
          setStocks(data)
        }
      } catch (error) {
        console.error('Failed to fetch stocks:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchStocks()
  }, [])

  // Clear search when popover closes
  useEffect(() => {
    if (!open) {
      setSearchQuery('')
    }
  }, [open])

  const selectedStock = stocks.find((stock) => stock.symbol === value)

  // Improved search filtering
  const filteredStocks = useMemo(() => {
    if (!searchQuery.trim()) {
      return stocks
    }

    const query = searchQuery.toLowerCase().trim()

    // Score-based filtering for better relevance
    const scoredStocks = stocks.map(stock => {
      const symbolLower = stock.symbol.toLowerCase()
      const nameLower = stock.name.toLowerCase()

      let score = 0

      // Exact symbol match - highest priority
      if (symbolLower === query) {
        score = 100
      }
      // Symbol starts with query
      else if (symbolLower.startsWith(query)) {
        score = 80
      }
      // Symbol contains query
      else if (symbolLower.includes(query)) {
        score = 60
      }
      // Name starts with query word
      else if (nameLower.startsWith(query) || nameLower.split(' ').some(word => word.startsWith(query))) {
        score = 50
      }
      // Name contains query
      else if (nameLower.includes(query)) {
        score = 30
      }
      // Abbreviation matching (e.g., "hul" matches "Hindustan Unilever Ltd")
      else {
        const words = stock.name.split(' ')
        const abbreviation = words.map(w => w[0]?.toLowerCase()).join('')
        if (abbreviation.includes(query)) {
          score = 40
        }
      }

      return { stock, score }
    })

    return scoredStocks
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.stock)
  }, [stocks, searchQuery])

  // Split into popular and other stocks when not searching
  const { popularStocks, otherStocks } = useMemo(() => {
    if (searchQuery.trim()) {
      return { popularStocks: [], otherStocks: filteredStocks }
    }

    const popular = stocks.filter(s => POPULAR_SYMBOLS.includes(s.symbol))
    const others = stocks.filter(s => !POPULAR_SYMBOLS.includes(s.symbol))

    // Sort popular stocks in the order defined
    popular.sort((a, b) =>
      POPULAR_SYMBOLS.indexOf(a.symbol) - POPULAR_SYMBOLS.indexOf(b.symbol)
    )

    return { popularStocks: popular, otherStocks: others }
  }, [stocks, searchQuery, filteredStocks])

  const handleSelect = (stock: Stock) => {
    onChange(stock.symbol, stock.id)
    setOpen(false)
  }

  const StockItem = ({ stock, showStar = false }: { stock: Stock, showStar?: boolean }) => (
    <button
      key={stock.id}
      onClick={() => handleSelect(stock)}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-3 text-left hover:bg-accent rounded-lg transition-colors cursor-pointer",
        value === stock.symbol && "bg-primary/10"
      )}
    >
      <Check
        className={cn(
          'h-4 w-4 flex-shrink-0',
          value === stock.symbol ? 'opacity-100 text-primary' : 'opacity-0'
        )}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono font-semibold text-foreground">{stock.symbol}</span>
          {showStar && <Star className="w-3 h-3 text-secondary fill-secondary" />}
        </div>
        <span className="text-xs text-muted-foreground truncate block">{stock.name}</span>
      </div>
    </button>
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-14 text-left bg-accent/50 border-border hover:bg-accent hover:border-primary/50 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="text-muted-foreground">Loading stocks...</span>
          ) : selectedStock ? (
            <div className="flex flex-col items-start">
              <span className="font-mono font-semibold">{selectedStock.symbol}</span>
              <span className="text-xs text-muted-foreground truncate max-w-[250px]">
                {selectedStock.name}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="w-4 h-4" />
              <span>Select a stock to predict...</span>
            </div>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0 bg-popover border-border" align="start">
        {/* Search Input */}
        <div className="flex items-center border-b border-border px-3 py-2">
          <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by symbol or company name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-0 outline-none text-sm placeholder:text-muted-foreground"
            autoFocus
          />
          {searchQuery && (
            <span className="text-xs text-muted-foreground">
              {filteredStocks.length} found
            </span>
          )}
        </div>

        {/* Stock List */}
        <div className="max-h-[350px] overflow-y-auto p-2">
          {filteredStocks.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No stocks found for "{searchQuery}"</p>
              <p className="text-xs mt-1">Try searching by symbol (e.g., TCS) or company name</p>
            </div>
          ) : searchQuery ? (
            // Show filtered results when searching
            <div className="space-y-1">
              {filteredStocks.map(stock => (
                <StockItem key={stock.id} stock={stock} />
              ))}
            </div>
          ) : (
            // Show categorized when not searching
            <>
              {/* Popular Stocks */}
              {popularStocks.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    <Star className="w-3 h-3" />
                    Popular Stocks
                  </div>
                  <div className="space-y-1">
                    {popularStocks.map(stock => (
                      <StockItem key={stock.id} stock={stock} showStar />
                    ))}
                  </div>
                </div>
              )}

              {/* All Securities */}
              <div>
                <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  <TrendingUp className="w-3 h-3" />
                  All Securities ({otherStocks.length})
                </div>
                <div className="space-y-1">
                  {otherStocks.map(stock => (
                    <StockItem key={stock.id} stock={stock} />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer hint */}
        <div className="border-t border-border px-3 py-2 text-xs text-muted-foreground bg-accent/30">
          💡 Tip: Type symbol like "TCS" or company name like "Tata"
        </div>
      </PopoverContent>
    </Popover>
  )
}

