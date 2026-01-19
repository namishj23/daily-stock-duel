import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function HowItWorksPage() {
    return (
        <div className="min-h-screen">
            <Header />
            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
                            How It <span className="text-gradient">Works</span>
                        </h1>

                        <div className="space-y-8">
                            <div className="p-6 rounded-2xl bg-card border border-border/50">
                                <h2 className="text-xl font-semibold mb-4">1. Sign Up</h2>
                                <p className="text-muted-foreground">
                                    Create your account using email or Google. Confirm you are 18+ years old to participate.
                                </p>
                            </div>

                            <div className="p-6 rounded-2xl bg-card border border-border/50">
                                <h2 className="text-xl font-semibold mb-4">2. Make Your Prediction</h2>
                                <p className="text-muted-foreground">
                                    You have a 24-hour window (8:30 AM to 8:30 AM IST) to predict the next trading day's market. Select any NSE stock and predict the percentage change (-20% to +20%). You can <strong className="text-foreground">edit your prediction anytime</strong> before the window closes - only your latest submission counts!
                                </p>
                            </div>

                            <div className="p-6 rounded-2xl bg-card border border-border/50">
                                <h2 className="text-xl font-semibold mb-4">3. Wait for Results</h2>
                                <p className="text-muted-foreground">
                                    After market close at 3:30 PM IST, we calculate the percentage movement of each predicted stock. The winner is determined by 4:00 PM IST.
                                </p>
                            </div>

                            <div className="p-6 rounded-2xl bg-card border border-border/50">
                                <h2 className="text-xl font-semibold mb-4">4. Winner Selection</h2>
                                <p className="text-muted-foreground">
                                    The user whose prediction is closest to the actual percentage change wins ₹500. In case of a tie, the earliest final submission wins.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
