import { Check, AlertTriangle, Info } from "lucide-react";
import { CONTEST_RULES, VALIDATION_RULES, PRIZE_CONFIG } from "@/lib/constants";

export function RulesSection() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Contest <span className="text-gradient-gold">Rules</span>
            </h2>
            <p className="text-muted-foreground">
              Fair, transparent, and skill-based. Read the complete rules before participating.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Rules */}
            <div className="p-6 rounded-2xl bg-card border border-border/50">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Check className="w-5 h-5 text-success" />
                Contest Guidelines
              </h3>
              <ul className="space-y-3">
                {CONTEST_RULES.map((rule, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-success" />
                    </span>
                    {rule}
                  </li>
                ))}
              </ul>
            </div>

            {/* Important Notes */}
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-card border border-border/50">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5 text-primary" />
                  Prize Details
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 rounded-xl bg-accent">
                    <span className="text-muted-foreground">Daily Prize</span>
                    <span className="text-2xl font-bold text-gradient-gold mono">
                      {PRIZE_CONFIG.CURRENCY_SYMBOL}{PRIZE_CONFIG.DAILY_PRIZE}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    One winner per day. Prize amount is fixed regardless of number of participants.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-warning/5 border border-warning/20">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                  Important Notice
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• This is a skill-based contest, not investment advice</li>
                  <li>• Participants must be {VALIDATION_RULES.MIN_AGE}+ years old</li>
                  <li>• Past performance does not guarantee future results</li>
                  <li>• Trading in stocks involves substantial risk</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
