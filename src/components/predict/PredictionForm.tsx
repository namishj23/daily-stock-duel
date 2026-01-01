import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { StockSelector } from "./StockSelector";
import { DirectionSelector } from "./DirectionSelector";
import { JustificationInput } from "./JustificationInput";
import { Clock, Lock, AlertTriangle, CheckCircle } from "lucide-react";
import { VALIDATION_RULES, CONTEST_TIMING } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

function isWithinSubmissionWindow(): boolean {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentTime = hours * 60 + minutes;
  
  const startTime = CONTEST_TIMING.SUBMISSION_START.hour * 60 + CONTEST_TIMING.SUBMISSION_START.minute;
  const endTime = CONTEST_TIMING.SUBMISSION_END.hour * 60 + CONTEST_TIMING.SUBMISSION_END.minute;
  
  // For demo purposes, always return true
  // In production: return currentTime >= startTime && currentTime <= endTime;
  return true;
}

export function PredictionForm() {
  const [stock, setStock] = useState("");
  const [direction, setDirection] = useState<"UP" | "DOWN" | null>(null);
  const [justification, setJustification] = useState("");
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const wordCount = countWords(justification);
  const isValid = stock && direction && wordCount >= VALIDATION_RULES.MIN_JUSTIFICATION_WORDS && ageConfirmed;
  const canSubmit = isValid && isWithinSubmissionWindow() && !isSubmitted;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setIsSubmitting(true);
    
    // Simulate API call - will be replaced with real backend
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    toast({
      title: "Prediction Submitted! 🎯",
      description: `Your ${direction} prediction for ${stock} has been locked in.`,
    });
  };

  if (isSubmitted) {
    return (
      <div className="p-8 rounded-2xl bg-card border border-success/30 text-center">
        <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-success" />
        </div>
        <h3 className="text-xl font-bold mb-2">Prediction Locked!</h3>
        <p className="text-muted-foreground mb-4">
          Your {direction} prediction for <span className="font-mono font-bold">{stock}</span> has been submitted.
        </p>
        <div className="p-4 rounded-xl bg-accent/50 text-sm text-muted-foreground">
          <p>Results will be announced after market close at 3:30 PM IST.</p>
          <p className="mt-2">Winner declared at 4:00 PM IST.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Submission Window Status */}
      <div className={`p-4 rounded-xl flex items-center gap-3 ${
        isWithinSubmissionWindow() 
          ? "bg-success/10 border border-success/30" 
          : "bg-warning/10 border border-warning/30"
      }`}>
        {isWithinSubmissionWindow() ? (
          <>
            <Clock className="w-5 h-5 text-success" />
            <div>
              <span className="font-medium text-success">Submission Window Open</span>
              <span className="text-sm text-muted-foreground ml-2">9:00 AM - 9:30 AM IST</span>
            </div>
          </>
        ) : (
          <>
            <Lock className="w-5 h-5 text-warning" />
            <div>
              <span className="font-medium text-warning">Submissions Closed</span>
              <span className="text-sm text-muted-foreground ml-2">Opens tomorrow at 9:00 AM IST</span>
            </div>
          </>
        )}
      </div>

      {/* Step 1: Stock Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">1</span>
          Select Stock
        </label>
        <StockSelector value={stock} onChange={setStock} />
      </div>

      {/* Step 2: Direction */}
      <div className="space-y-3">
        <label className="text-sm font-medium flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">2</span>
          Predict Direction
        </label>
        <DirectionSelector value={direction} onChange={setDirection} />
      </div>

      {/* Step 3: Justification */}
      <div className="space-y-3">
        <label className="text-sm font-medium flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">3</span>
          Your Analysis <span className="text-muted-foreground font-normal">(min {VALIDATION_RULES.MIN_JUSTIFICATION_WORDS} words)</span>
        </label>
        <JustificationInput value={justification} onChange={setJustification} />
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
          I confirm that I am {VALIDATION_RULES.MIN_AGE} years or older and I understand that this is a skill-based contest. 
          I have read and agree to the <a href="/terms" className="text-primary hover:underline">Terms & Conditions</a> and{" "}
          <a href="/disclaimer" className="text-primary hover:underline">Disclaimer</a>.
        </label>
      </div>

      {/* Warning */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-warning/5 border border-warning/20 text-sm">
        <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
        <p className="text-muted-foreground">
          Once submitted, your prediction <strong className="text-foreground">cannot be changed</strong>. 
          Make sure you've reviewed your selection before submitting.
        </p>
      </div>

      {/* Submit Button */}
      <Button
        variant="hero"
        size="xl"
        className="w-full"
        disabled={!canSubmit || isSubmitting}
        onClick={handleSubmit}
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Lock className="w-5 h-5" />
            Lock In Prediction
          </>
        )}
      </Button>
    </div>
  );
}
