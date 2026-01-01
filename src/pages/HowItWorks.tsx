import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Clock, 
  Target, 
  CheckCircle, 
  Trophy, 
  ArrowRight,
  Calculator,
  Award,
  AlertTriangle,
  Calendar
} from "lucide-react";
import { PRIZE_CONFIG, CONTEST_TIMING, VALIDATION_RULES } from "@/lib/constants";

const HowItWorks = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="text-center mb-16">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                How <span className="text-gradient">StockPredict</span> Works
              </h1>
              <p className="text-muted-foreground max-w-xl mx-auto">
                A complete guide to participating in India's premier daily stock prediction contest.
              </p>
            </div>

            {/* Daily Timeline */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-primary" />
                Daily Contest Timeline
              </h2>
              
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                
                <div className="space-y-6">
                  {[
                    { time: "9:00 AM", title: "Submissions Open", desc: "Login and start making your prediction", icon: Clock, color: "primary" },
                    { time: "9:30 AM", title: "Submissions Close", desc: "All predictions are locked", icon: Target, color: "warning" },
                    { time: "9:15 AM", title: "Market Opens", desc: "Entry prices are recorded at market open", icon: Calculator, color: "muted-foreground" },
                    { time: "3:30 PM", title: "Market Closes", desc: "Exit prices are recorded at market close", icon: CheckCircle, color: "muted-foreground" },
                    { time: "4:00 PM", title: "Winner Announced", desc: "Daily winner is declared and notified", icon: Trophy, color: "secondary" },
                  ].map((item, index) => (
                    <div key={index} className="relative flex gap-6 pl-8">
                      <div className={`absolute left-2 w-5 h-5 rounded-full bg-${item.color === 'secondary' ? 'secondary' : item.color === 'warning' ? 'warning' : item.color === 'primary' ? 'primary' : 'muted'} flex items-center justify-center -translate-x-1/2 border-4 border-background`}>
                        <item.icon className={`w-3 h-3 ${item.color === 'muted-foreground' ? 'text-muted-foreground' : 'text-primary-foreground'}`} />
                      </div>
                      <div className="flex-1 p-4 rounded-xl bg-card border border-border/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold">{item.title}</span>
                          <span className="font-mono text-sm text-muted-foreground">{item.time} IST</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Winner Selection */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Award className="w-6 h-6 text-secondary" />
                Winner Selection Criteria
              </h2>
              
              <div className="p-6 rounded-2xl bg-card border border-border/50 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 rounded-xl bg-accent/50">
                    <h3 className="font-semibold mb-2">Primary Criteria</h3>
                    <p className="text-sm text-muted-foreground">
                      Highest <span className="text-foreground font-medium">absolute percentage change</span> among 
                      all predictions with the <span className="text-success">correct direction</span>.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-accent/50">
                    <h3 className="font-semibold mb-2">Tie-Breaker</h3>
                    <p className="text-sm text-muted-foreground">
                      If two predictions have the same % change, the one with 
                      <span className="text-foreground font-medium"> earlier submission time</span> wins.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-success/10 border border-success/20">
                  <h3 className="font-semibold mb-2 text-success">Example</h3>
                  <p className="text-sm text-muted-foreground">
                    User A predicts RELIANCE will go UP. It opens at ₹2,500 and closes at ₹2,575 (+3%).
                    User B predicts TCS will go DOWN. It opens at ₹4,000 and closes at ₹3,880 (-3%).
                    Both are correct, both have 3% change. User with earlier submission time wins.
                  </p>
                </div>
              </div>
            </section>

            {/* Rules */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-primary" />
                Contest Rules
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "One prediction per user per day",
                  "NSE Top 100 stocks only",
                  `Minimum ${VALIDATION_RULES.MIN_JUSTIFICATION_WORDS} words justification required`,
                  "Submissions between 9:00 AM - 9:30 AM IST",
                  `Participants must be ${VALIDATION_RULES.MIN_AGE}+ years old`,
                  "Predictions cannot be changed once submitted",
                  `Daily prize: ${PRIZE_CONFIG.CURRENCY_SYMBOL}${PRIZE_CONFIG.DAILY_PRIZE}`,
                  "One winner per day",
                ].map((rule, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border/50">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{rule}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Disclaimer */}
            <section className="mb-16">
              <div className="p-6 rounded-2xl bg-warning/5 border border-warning/20">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-warning">
                  <AlertTriangle className="w-6 h-6" />
                  Important Disclaimer
                </h2>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• This is a skill-based prediction contest, NOT investment advice.</li>
                  <li>• Past performance in this contest does not guarantee future results.</li>
                  <li>• Trading in stock markets involves substantial risk of loss.</li>
                  <li>• Please consult a SEBI-registered advisor before making any investment decisions.</li>
                  <li>• StockPredict is not responsible for any trading losses.</li>
                </ul>
              </div>
            </section>

            {/* CTA */}
            <div className="text-center">
              <Link to="/predict">
                <Button variant="hero" size="xl">
                  Start Predicting Now
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorks;
