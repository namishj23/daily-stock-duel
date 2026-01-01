import { CheckCircle, Clock, Target, Trophy, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Clock,
    title: "Morning Window",
    description: "Log in between 9:00 AM - 9:30 AM IST to make your prediction",
    highlight: "30 min only",
  },
  {
    icon: Target,
    title: "Pick Your Stock",
    description: "Select from NSE Top 100 stocks and predict UP or DOWN direction",
    highlight: "100+ stocks",
  },
  {
    icon: CheckCircle,
    title: "Justify Your Pick",
    description: "Write a 50+ word analysis explaining your prediction rationale",
    highlight: "Skill-based",
  },
  {
    icon: Trophy,
    title: "Win Daily",
    description: "Highest percentage gain in correct direction wins ₹500 daily",
    highlight: "₹500/day",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Simple, transparent, and skill-based. Here's how you can participate in the daily contest.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-border to-transparent z-0">
                  <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
              )}
              
              <div className="relative p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 group-hover:shadow-glow h-full">
                {/* Step number */}
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground shadow-glow">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>

                {/* Content */}
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{step.description}</p>
                
                {/* Highlight badge */}
                <span className="inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  {step.highlight}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
