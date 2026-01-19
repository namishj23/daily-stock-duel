'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PredictionMeterProps {
    value: number
    onChange: (value: number) => void
}

export function PredictionMeter({ value, onChange }: PredictionMeterProps) {
    const [isDragging, setIsDragging] = useState(false)
    const sliderRef = useRef<HTMLDivElement>(null)

    const getPercentFromPosition = useCallback((clientX: number) => {
        if (!sliderRef.current) return 0
        const rect = sliderRef.current.getBoundingClientRect()
        const x = clientX - rect.left
        const percentage = (x / rect.width) * 40 - 20 // Convert to -20 to +20 range
        return Math.max(-20, Math.min(20, Math.round(percentage * 100) / 100))
    }, [])

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true)
        onChange(getPercentFromPosition(e.clientX))
    }

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (isDragging) {
            onChange(getPercentFromPosition(e.clientX))
        }
    }, [isDragging, onChange, getPercentFromPosition])

    const handleMouseUp = useCallback(() => {
        setIsDragging(false)
    }, [])

    const handleTouchStart = (e: React.TouchEvent) => {
        setIsDragging(true)
        onChange(getPercentFromPosition(e.touches[0].clientX))
    }

    const handleTouchMove = useCallback((e: TouchEvent) => {
        if (isDragging) {
            onChange(getPercentFromPosition(e.touches[0].clientX))
        }
    }, [isDragging, onChange, getPercentFromPosition])

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove)
            window.addEventListener('mouseup', handleMouseUp)
            window.addEventListener('touchmove', handleTouchMove)
            window.addEventListener('touchend', handleMouseUp)
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
            window.removeEventListener('touchmove', handleTouchMove)
            window.removeEventListener('touchend', handleMouseUp)
        }
    }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove])

    const [inputValue, setInputValue] = useState(value.toString())

    // Update input value when prop value changes (from slider or presets)
    useEffect(() => {
        if (!isDragging) {
            setInputValue(value === 0 ? '0' : value.toString())
        }
    }, [value, isDragging])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setInputValue(val)

        const numericVal = parseFloat(val)
        if (!isNaN(numericVal)) {
            // Apply bounds and precision
            const boundedVal = Math.max(-20, Math.min(20, Math.round(numericVal * 100) / 100))
            onChange(boundedVal)
        }
    }

    const handleInputBlur = () => {
        // Reset to prop value on blur to clean up invalid strings (like "5.")
        setInputValue(value.toString())
    }

    // Calculate position (0 = -20%, 100 = +20%)
    const position = ((value + 20) / 40) * 100

    // Determine color based on value
    const getColor = () => {
        if (value > 0) return 'text-success'
        if (value < 0) return 'text-warning'
        return 'text-muted-foreground'
    }

    const getBgColor = () => {
        if (value > 0) return 'bg-success'
        if (value < 0) return 'bg-warning'
        return 'bg-muted-foreground'
    }

    const getGradient = () => {
        if (value > 0) {
            return `linear-gradient(90deg, hsl(var(--muted)) 50%, hsl(var(--success)) 50%, hsl(var(--success)) ${50 + (value / 20) * 50}%, hsl(var(--muted)) ${50 + (value / 20) * 50}%)`
        } else if (value < 0) {
            return `linear-gradient(90deg, hsl(var(--muted)) ${50 + (value / 20) * 50}%, hsl(var(--warning)) ${50 + (value / 20) * 50}%, hsl(var(--warning)) 50%, hsl(var(--muted)) 50%)`
        }
        return 'hsl(var(--muted))'
    }

    return (
        <div className="space-y-6">
            {/* Current Value Display / Editable Input */}
            <div className="text-center">
                <div className="inline-flex items-center justify-center relative group">
                    <span className={cn(
                        "text-5xl font-bold mono transition-colors",
                        value > 0 ? "text-success" : "text-transparent"
                    )}>
                        +
                    </span>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        className={cn(
                            "w-[4.5ch] bg-transparent text-5xl font-bold mono text-center focus:outline-none transition-colors border-b-2 border-transparent focus:border-primary/30 mx-[-0.5ch]",
                            getColor()
                        )}
                        placeholder="0"
                    />
                    <span className={cn(
                        "text-5xl font-bold mono transition-colors",
                        getColor()
                    )}>
                        %
                    </span>

                    {/* Tooltip hint */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Click to type percentage
                    </div>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                    {value > 0 ? 'Bullish' : value < 0 ? 'Bearish' : 'Neutral'} Prediction
                </div>
            </div>

            {/* Slider Track */}
            <div className="relative pt-2 pb-6">
                {/* Tick Labels */}
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                    <span className="text-warning font-mono">-20%</span>
                    <span>-10%</span>
                    <span>0%</span>
                    <span>+10%</span>
                    <span className="text-success font-mono">+20%</span>
                </div>

                {/* Track */}
                <div
                    ref={sliderRef}
                    className="relative h-4 rounded-full bg-accent/50 cursor-pointer overflow-hidden border border-border/50"
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchStart}
                >
                    {/* Filled Track */}
                    <div
                        className="absolute inset-0 rounded-full transition-all duration-75"
                        style={{ background: getGradient() }}
                    />

                    {/* Center Line */}
                    <div className="absolute top-0 left-1/2 w-0.5 h-full bg-foreground/20 -translate-x-1/2" />

                    {/* Thumb */}
                    <div
                        className={cn(
                            "absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full shadow-lg border-2 border-white transition-transform cursor-grab active:cursor-grabbing",
                            getBgColor(),
                            isDragging && "scale-110"
                        )}
                        style={{ left: `calc(${position}% - 12px)` }}
                    />
                </div>

                {/* Tick Marks */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-between px-0.5">
                    {[-20, -10, 0, 10, 20].map((tick) => (
                        <div
                            key={tick}
                            className={cn(
                                "w-0.5 h-2 rounded-full",
                                tick === 0 ? "bg-foreground/40" : "bg-border"
                            )}
                        />
                    ))}
                </div>
            </div>

            {/* Quick Select Buttons */}
            <div className="flex gap-2 justify-center flex-wrap">
                {[-20, -10, -5, 0, 5, 10, 20].map((preset) => (
                    <button
                        key={preset}
                        type="button"
                        onClick={() => onChange(preset)}
                        className={cn(
                            "px-3 py-1.5 text-sm font-mono rounded-lg border transition-all",
                            value === preset
                                ? preset > 0
                                    ? "bg-success/20 border-success text-success"
                                    : preset < 0
                                        ? "bg-warning/20 border-warning text-warning"
                                        : "bg-muted border-foreground/20 text-foreground"
                                : "bg-accent/30 border-border hover:border-primary/50"
                        )}
                    >
                        {preset > 0 ? '+' : ''}{preset}%
                    </button>
                ))}
            </div>

            {/* Direction Indicators */}
            <div className="flex justify-between items-center px-4">
                <div className={cn(
                    "flex items-center gap-2 transition-opacity",
                    value < 0 ? "opacity-100" : "opacity-40"
                )}>
                    <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        value < 0 ? "bg-warning text-warning-foreground" : "bg-warning/20 text-warning"
                    )}>
                        <TrendingDown className="w-5 h-5" />
                    </div>
                    <div className="text-sm">
                        <div className="font-medium">Bearish</div>
                        <div className="text-xs text-muted-foreground">Stock will fall</div>
                    </div>
                </div>

                <div className={cn(
                    "flex items-center gap-2 transition-opacity",
                    value > 0 ? "opacity-100" : "opacity-40"
                )}>
                    <div className="text-sm text-right">
                        <div className="font-medium">Bullish</div>
                        <div className="text-xs text-muted-foreground">Stock will rise</div>
                    </div>
                    <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        value > 0 ? "bg-success text-success-foreground" : "bg-success/20 text-success"
                    )}>
                        <TrendingUp className="w-5 h-5" />
                    </div>
                </div>
            </div>
        </div>
    )
}
