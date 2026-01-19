'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { StockSelector } from './StockSelector'
import { PredictionMeter } from './PredictionMeter'
import { Clock, Lock, AlertTriangle, CheckCircle, CalendarX, RefreshCw } from 'lucide-react'
import { CONTEST_TIMING } from '@/lib/constants'
import { useToast } from '@/hooks/use-toast'
import { isMarketOpen, getHolidayName, getNextTradingDay } from '@/lib/trading-holidays'

function isWithinSubmissionWindow(): boolean {
  // Time constraint removed - predictions allowed anytime
  return true
}

function getPredictionDay(): { day: string, closesAt: string, isHoliday: boolean, holidayName: string | null } {
  const now = new Date()
  const istOffset = 5.5 * 60 * 60 * 1000
  const istTime = new Date(now.getTime() + istOffset)

  const hours = istTime.getUTCHours()
  const minutes = istTime.getUTCMinutes()

  // Calculate prediction date in IST
  let predictionDate = new Date(istTime.getUTCFullYear(), istTime.getUTCMonth(), istTime.getUTCDate())

  // If after 8:30 AM IST, predict for tomorrow
  if (hours > 8 || (hours === 8 && minutes >= 30)) {
    predictionDate.setDate(predictionDate.getDate() + 1)
  }

  // Check if it's a trading day, if not get next trading day
  if (!isMarketOpen(predictionDate)) {
    predictionDate = getNextTradingDay(predictionDate)
  }

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const day = daysOfWeek[predictionDate.getDay()]

  // Window closes next day at 8:30 AM
  const closesDate = new Date(predictionDate)
  closesDate.setDate(closesDate.getDate() + 1)
  const closesDay = daysOfWeek[closesDate.getDay()]

  // Check if original date (before skipping weekends/holidays) was a holiday/weekend
  let originalDate = new Date(istTime.getUTCFullYear(), istTime.getUTCMonth(), istTime.getUTCDate())
  if (hours > 8 || (hours === 8 && minutes >= 30)) {
    originalDate.setDate(originalDate.getDate() + 1)
  }
  const isHoliday = !isMarketOpen(originalDate)
  const holidayName = getHolidayName(originalDate)

  return { day, closesAt: `${closesDay} 8:30 AM`, isHoliday, holidayName }
}

export function PredictionForm() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stock, setStock] = useState('')
  const [stockId, setStockId] = useState('')
  const [predictedChange, setPredictedChange] = useState(0)
  const [ageConfirmed, setAgeConfirmed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [existingPrediction, setExistingPrediction] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const { toast } = useToast()

  // Check if user has already submitted today
  useEffect(() => {
    async function checkExistingPrediction() {
      if (session?.user) {
        try {
          const res = await fetch('/api/predictions')
          if (res.ok) {
            const data = await res.json()
            if (data.prediction) {
              setExistingPrediction(data.prediction)
              // Pre-fill form with existing prediction
              setStock(data.prediction.stock?.symbol || '')
              setStockId(data.prediction.stockId || '')
              setPredictedChange(data.prediction.predictedChange || 0)
              setAgeConfirmed(true) // Already confirmed when first submitted
            }
          }
        } catch (error) {
          console.error('Failed to check prediction:', error)
        }
      }
    }
    checkExistingPrediction()
  }, [session])

  const isValid = stock && stockId && predictedChange !== 0 && ageConfirmed
  const canSubmit = isValid && isWithinSubmissionWindow()

  // Check if values have changed from existing prediction
  const hasChanges = existingPrediction ? (
    stockId !== existingPrediction.stockId ||
    predictedChange !== existingPrediction.predictedChange
  ) : true

  const handleStockChange = (symbol: string, id: string) => {
    setStock(symbol)
    setStockId(id)
    if (existingPrediction) setIsEditing(true)
  }

  const handlePredictionChange = (value: number) => {
    setPredictedChange(value)
    if (existingPrediction) setIsEditing(true)
  }

  const handleSubmit = async () => {
    if (!canSubmit) return

    if (status !== 'authenticated') {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to submit a prediction',
        variant: 'destructive',
      })
      router.push('/signin')
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch('/api/predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stockId,
          predictedChange,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast({
          title: 'Submission failed',
          description: data.error || 'Something went wrong',
          variant: 'destructive',
        })
        return
      }

      setExistingPrediction(data.prediction)
      setIsEditing(false)

      toast({
        title: existingPrediction ? 'Prediction Updated! 🎯' : 'Prediction Submitted! 🎯',
        description: `Your ${predictedChange > 0 ? '+' : ''}${Number(predictedChange).toFixed(2)}% prediction for ${stock} has been ${existingPrediction ? 'updated' : 'locked in'}.`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit prediction. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Existing Prediction Banner */}
      {existingPrediction && (
        <div className="p-4 rounded-xl flex items-center gap-3 bg-success/10 border border-success/30">
          <CheckCircle className="w-5 h-5 text-success" />
          <div className="flex-1">
            <div className="font-medium">Current Prediction: <span className={existingPrediction.predictedChange > 0 ? 'text-success' : 'text-warning'}>{existingPrediction.predictedChange > 0 ? '+' : ''}{Number(existingPrediction.predictedChange).toFixed(2)}%</span> on {existingPrediction.stock?.symbol}</div>
            <div className="text-sm text-muted-foreground">You can modify your prediction until the window closes</div>
          </div>
        </div>
      )}

      {/* Prediction Info Banner */}
      <div className="p-4 rounded-xl flex items-center gap-3 bg-primary/10 border border-primary/30">
        <Clock className="w-5 h-5 text-primary" />
        <div className="flex-1">
          <div className="font-medium">Predicting for {getPredictionDay().day}'s Market</div>
          <div className="text-sm text-muted-foreground">Window closes at {getPredictionDay().closesAt} IST</div>
        </div>
      </div>

      {/* Holiday/Weekend Warning */}
      {getPredictionDay().isHoliday && (
        <div className="p-4 rounded-xl flex items-center gap-3 bg-warning/10 border border-warning/30">
          <CalendarX className="w-5 h-5 text-warning" />
          <div className="flex-1">
            <div className="font-medium text-warning">
              {getPredictionDay().holidayName ? 'Trading Holiday' : 'Weekend - Market Closed'}
            </div>
            <div className="text-sm text-muted-foreground">
              {getPredictionDay().holidayName
                ? `${getPredictionDay().holidayName} - Predicting for next trading day instead`
                : 'Market closed on weekends - Predicting for next trading day instead'
              }
            </div>
          </div>
        </div>
      )}

      {/* Auth check */}
      {status === 'unauthenticated' && (
        <div className="p-4 rounded-xl bg-primary/10 border border-primary/30 text-center">
          <p className="text-sm mb-2">You need to sign in to submit a prediction</p>
          <Button variant="outline" size="sm" onClick={() => router.push('/signin')}>
            Sign In
          </Button>
        </div>
      )}

      {/* Step 1: Stock Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">1</span>
          Select Stock
        </label>
        <StockSelector value={stock} onChange={handleStockChange} />
      </div>

      {/* Step 2: Prediction Meter */}
      <div className="space-y-3">
        <label className="text-sm font-medium flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">2</span>
          Predict Price Change
        </label>
        <div className="p-6 rounded-xl bg-accent/30 border border-border/50">
          <PredictionMeter value={predictedChange} onChange={handlePredictionChange} />
        </div>
        {predictedChange === 0 && (
          <p className="text-xs text-muted-foreground text-center">
            Drag the slider or click a preset to make your prediction
          </p>
        )}
      </div>

      {/* Age Confirmation */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-accent/50 border border-border">
        <Checkbox
          id="age-confirm"
          checked={ageConfirmed}
          onCheckedChange={(checked) => setAgeConfirmed(checked as boolean)}
          className="mt-0.5"
        />
        <label htmlFor="age-confirm" className="text-sm text-muted-foreground cursor-pointer">
          I confirm that I am 18 years or older and I understand that this is a skill-based contest.
          I have read and agree to the <a href="/terms" className="text-primary hover:underline">Terms & Conditions</a> and{' '}
          <a href="/disclaimer" className="text-primary hover:underline">Disclaimer</a>.
        </label>
      </div>

      {/* Info */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20 text-sm">
        <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <p className="text-muted-foreground">
          You can <strong className="text-foreground">edit your prediction anytime</strong> before the window closes.
          Your latest submission will be used for the contest.
        </p>
      </div>

      {/* Submit Button */}
      <Button
        variant="hero"
        size="xl"
        className="w-full"
        disabled={!canSubmit || isSubmitting || status !== 'authenticated' || (existingPrediction && !hasChanges)}
        onClick={handleSubmit}
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            {existingPrediction ? 'Updating...' : 'Submitting...'}
          </>
        ) : existingPrediction ? (
          <>
            <RefreshCw className="w-5 h-5" />
            {hasChanges ? 'Update Prediction' : 'No Changes to Update'}
          </>
        ) : (
          <>
            <Lock className="w-5 h-5" />
            Lock In Prediction
          </>
        )}
      </Button>
    </div>
  )
}
