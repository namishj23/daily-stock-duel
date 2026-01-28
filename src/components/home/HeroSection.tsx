import { Button } from '@/components/ui/button'
import { ArrowRight, Trophy, Clock, TrendingUp, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { PRIZE_CONFIG } from '@/lib/constants'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 hero-glow" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center stagger-children">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border/50 mb-8">
            <span className="w-2 h-2 rounded-full bg-success pulse-live" />
            <span className="text-sm font-medium">Daily Contest Live</span>
            <Sparkles className="w-4 h-4 text-secondary" />
          </div>

          {/* Main headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
            Predict Stocks.
            <br />
            <span className="text-gradient">Win Daily.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            India's premier skill-based stock prediction contest. Pick the best performing NSE stock or ETF every day and win{' '}
            <span className="text-gradient-gold font-bold">
              {PRIZE_CONFIG.CURRENCY_SYMBOL}{PRIZE_CONFIG.DAILY_PRIZE}
            </span>{' '}
            daily.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/predict">
              <Button variant="hero" size="xl" className="w-full sm:w-auto">
                Start Predicting
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button variant="glass" size="xl" className="w-full sm:w-auto">
                How It Works
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            <div className="p-4 rounded-xl bg-card/50 border border-border/50 backdrop-blur">
              <Trophy className="w-6 h-6 text-secondary mx-auto mb-2" />
              <div className="text-2xl font-bold mono">{PRIZE_CONFIG.CURRENCY_SYMBOL}500</div>
              <div className="text-xs text-muted-foreground">Daily Prize</div>
            </div>
            <div className="p-4 rounded-xl bg-card/50 border border-border/50 backdrop-blur">
              <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold mono">24hr</div>
              <div className="text-xs text-muted-foreground">To Predict</div>
            </div>
            <div className="p-4 rounded-xl bg-card/50 border border-border/50 backdrop-blur">
              <TrendingUp className="w-6 h-6 text-success mx-auto mb-2" />
              <div className="text-2xl font-bold mono">All</div>
              <div className="text-xs text-muted-foreground">NSE Stocks</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
