'use client'

import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface DirectionSelectorProps {
  value: "UP" | "DOWN" | null;
  onChange: (value: "UP" | "DOWN") => void;
}

export function DirectionSelector({ value, onChange }: DirectionSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <button
        type="button"
        onClick={() => onChange("UP")}
        className={cn(
          "relative p-6 rounded-xl border-2 transition-all duration-200 group",
          value === "UP"
            ? "border-success bg-success/10 shadow-[0_0_20px_-5px_hsl(var(--success)/0.5)]"
            : "border-border bg-accent/30 hover:border-success/50 hover:bg-success/5"
        )}
      >
        <div className="flex flex-col items-center gap-3">
          <div className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center transition-all",
            value === "UP"
              ? "bg-success text-success-foreground scale-110"
              : "bg-success/20 text-success group-hover:scale-105"
          )}>
            <TrendingUp className="w-7 h-7" />
          </div>
          <div>
            <div className="font-semibold text-lg">Bullish</div>
            <div className="text-xs text-muted-foreground">Stock will go UP</div>
          </div>
        </div>
        {value === "UP" && (
          <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-success flex items-center justify-center">
            <svg className="w-4 h-4 text-success-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </button>

      <button
        type="button"
        onClick={() => onChange("DOWN")}
        className={cn(
          "relative p-6 rounded-xl border-2 transition-all duration-200 group",
          value === "DOWN"
            ? "border-warning bg-warning/10 shadow-[0_0_20px_-5px_hsl(var(--warning)/0.5)]"
            : "border-border bg-accent/30 hover:border-warning/50 hover:bg-warning/5"
        )}
      >
        <div className="flex flex-col items-center gap-3">
          <div className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center transition-all",
            value === "DOWN"
              ? "bg-warning text-warning-foreground scale-110"
              : "bg-warning/20 text-warning group-hover:scale-105"
          )}>
            <TrendingDown className="w-7 h-7" />
          </div>
          <div>
            <div className="font-semibold text-lg">Bearish</div>
            <div className="text-xs text-muted-foreground">Stock will go DOWN</div>
          </div>
        </div>
        {value === "DOWN" && (
          <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-warning flex items-center justify-center">
            <svg className="w-4 h-4 text-warning-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </button>
    </div>
  );
}
