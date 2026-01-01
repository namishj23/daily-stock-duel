import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PredictionForm } from "@/components/predict/PredictionForm";
import { Trophy, Clock, Users } from "lucide-react";
import { PRIZE_CONFIG } from "@/lib/constants";

const Predict = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Today's <span className="text-gradient">Prediction</span>
              </h1>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Select your stock, predict the direction, and share your analysis.
                The best prediction wins {PRIZE_CONFIG.CURRENCY_SYMBOL}{PRIZE_CONFIG.DAILY_PRIZE} daily.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-card border border-border/50 text-center">
                <Trophy className="w-6 h-6 text-secondary mx-auto mb-2" />
                <div className="text-xl font-bold mono text-gradient-gold">
                  {PRIZE_CONFIG.CURRENCY_SYMBOL}{PRIZE_CONFIG.DAILY_PRIZE}
                </div>
                <div className="text-xs text-muted-foreground">Today's Prize</div>
              </div>
              <div className="p-4 rounded-xl bg-card border border-border/50 text-center">
                <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-xl font-bold mono">9:00 - 9:30</div>
                <div className="text-xs text-muted-foreground">AM IST Window</div>
              </div>
              <div className="p-4 rounded-xl bg-card border border-border/50 text-center">
                <Users className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                <div className="text-xl font-bold mono">124</div>
                <div className="text-xs text-muted-foreground">Predictions Today</div>
              </div>
            </div>

            {/* Main Form Card */}
            <div className="p-8 rounded-2xl bg-card border border-border/50 shadow-card">
              <PredictionForm />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Predict;
