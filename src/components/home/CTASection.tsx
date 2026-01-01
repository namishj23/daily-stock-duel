import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 hero-glow opacity-50" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 mb-6">
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-secondary">New contest starts every morning</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Test Your
            <br />
            <span className="text-gradient">Market Skills?</span>
          </h2>

          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of traders and analysts competing daily. Put your market knowledge to the test.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/predict">
              <Button variant="hero" size="xl" className="w-full sm:w-auto">
                Start Predicting Now
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground mt-6">
            Free to join • No credit card required • Win real money
          </p>
        </div>
      </div>
    </section>
  );
}
