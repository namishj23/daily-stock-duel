import { useState } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { NSE_TOP_100_STOCKS } from "@/lib/constants";

interface StockSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function StockSelector({ value, onChange }: StockSelectorProps) {
  const [open, setOpen] = useState(false);

  const selectedStock = NSE_TOP_100_STOCKS.find((stock) => stock.symbol === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-14 text-left bg-accent/50 border-border hover:bg-accent hover:border-primary/50 transition-colors"
        >
          {selectedStock ? (
            <div className="flex flex-col items-start">
              <span className="font-mono font-semibold">{selectedStock.symbol}</span>
              <span className="text-xs text-muted-foreground truncate max-w-[250px]">
                {selectedStock.name}
              </span>
            </div>
          ) : (
            <span className="text-muted-foreground">Select a stock...</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0 bg-popover border-border" align="start">
        <Command className="bg-transparent">
          <div className="flex items-center border-b border-border px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput placeholder="Search NSE stocks..." className="h-12 border-0 focus:ring-0" />
          </div>
          <CommandList className="max-h-[300px]">
            <CommandEmpty>No stock found.</CommandEmpty>
            <CommandGroup>
              {NSE_TOP_100_STOCKS.map((stock) => (
                <CommandItem
                  key={stock.symbol}
                  value={`${stock.symbol} ${stock.name}`}
                  onSelect={() => {
                    onChange(stock.symbol);
                    setOpen(false);
                  }}
                  className="cursor-pointer hover:bg-accent py-3"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === stock.symbol ? "opacity-100 text-primary" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="font-mono font-semibold">{stock.symbol}</span>
                    <span className="text-xs text-muted-foreground">{stock.name}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
