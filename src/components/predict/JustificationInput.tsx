import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { VALIDATION_RULES } from "@/lib/constants";

interface JustificationInputProps {
  value: string;
  onChange: (value: string) => void;
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

export function JustificationInput({ value, onChange }: JustificationInputProps) {
  const [wordCount, setWordCount] = useState(0);
  const minWords = VALIDATION_RULES.MIN_JUSTIFICATION_WORDS;
  const isValid = wordCount >= minWords;

  useEffect(() => {
    setWordCount(countWords(value));
  }, [value]);

  return (
    <div className="space-y-2">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Explain your prediction rationale. Include technical indicators, news, fundamentals, or market sentiment that supports your prediction..."
        className={cn(
          "min-h-[160px] bg-accent/50 border-border resize-none transition-colors",
          "hover:border-primary/50 focus:border-primary focus:ring-primary/20",
          isValid && "border-success/50"
        )}
      />
      <div className="flex justify-between items-center text-sm">
        <p className="text-muted-foreground">
          Share your analysis: technical indicators, news, market trends, etc.
        </p>
        <div className={cn(
          "font-mono px-2 py-1 rounded-md transition-colors",
          isValid 
            ? "bg-success/10 text-success" 
            : wordCount > 0 
              ? "bg-warning/10 text-warning"
              : "text-muted-foreground"
        )}>
          {wordCount} / {minWords} words
        </div>
      </div>
    </div>
  );
}
