import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { FileText } from 'lucide-react'
import { VALIDATION_RULES, PRIZE_CONFIG } from '@/lib/constants'

export default function TermsPage() {
    return (
        <div className="min-h-screen">
            <Header />
            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <div className="mb-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                                <FileText className="w-4 h-4 text-primary" />
                                <span className="text-sm font-medium">Legal Document</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">Terms & Conditions</h1>
                            <p className="text-muted-foreground">Last updated: January 2026</p>
                        </div>

                        <div className="prose prose-invert max-w-none space-y-6">
                            <section className="p-6 rounded-2xl bg-card border border-border/50">
                                <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
                                <p className="text-muted-foreground">
                                    By accessing and using StockPredict ("the Platform"), you accept and agree to be bound by these
                                    Terms and Conditions. If you do not agree to these terms, please do not use the Platform.
                                </p>
                            </section>

                            <section className="p-6 rounded-2xl bg-card border border-border/50">
                                <h2 className="text-xl font-semibold mb-4">2. Eligibility</h2>
                                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                    <li>You must be at least {VALIDATION_RULES.MIN_AGE} years of age to participate</li>
                                    <li>You must be a resident of India</li>
                                    <li>You must have a valid email address</li>
                                    <li>Employees of StockPredict and their immediate family members are not eligible</li>
                                </ul>
                            </section>

                            <section className="p-6 rounded-2xl bg-card border border-border/50">
                                <h2 className="text-xl font-semibold mb-4">3. Contest Rules</h2>
                                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                    <li>One prediction per user per day</li>
                                    <li>Predictions must be submitted between 9:00 AM and 10:00 AM IST</li>
                                    <li>Any NSE listed stock is eligible for prediction</li>
                                    <li>A minimum of {VALIDATION_RULES.MIN_JUSTIFICATION_WORDS} words justification is required</li>
                                    <li>Once submitted, predictions cannot be modified or cancelled</li>
                                    <li>Winners are determined based on the highest percentage change in the correct direction</li>
                                    <li>In case of a tie, the earlier submission wins</li>
                                </ul>
                            </section>

                            <section className="p-6 rounded-2xl bg-card border border-border/50">
                                <h2 className="text-xl font-semibold mb-4">4. Prizes</h2>
                                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                    <li>Daily prize: {PRIZE_CONFIG.CURRENCY_SYMBOL}{PRIZE_CONFIG.DAILY_PRIZE}</li>
                                    <li>Exactly one winner is declared per day</li>
                                    <li>Prizes are subject to applicable taxes as per Indian tax laws</li>
                                    <li>Prize money will be credited within 7 business days of winning</li>
                                    <li>StockPredict reserves the right to withhold prizes in case of suspected fraud</li>
                                </ul>
                            </section>

                            <section className="p-6 rounded-2xl bg-card border border-border/50">
                                <h2 className="text-xl font-semibold mb-4">5. User Conduct</h2>
                                <p className="text-muted-foreground mb-4">Users agree not to:</p>
                                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                    <li>Create multiple accounts</li>
                                    <li>Use automated tools or bots for predictions</li>
                                    <li>Engage in any form of market manipulation or insider trading</li>
                                    <li>Share account credentials with others</li>
                                    <li>Use the platform for any illegal purpose</li>
                                </ul>
                            </section>

                            <section className="p-6 rounded-2xl bg-card border border-border/50">
                                <h2 className="text-xl font-semibold mb-4">6. Account Suspension</h2>
                                <p className="text-muted-foreground">
                                    StockPredict reserves the right to suspend or terminate accounts that violate these terms,
                                    engage in fraudulent activity, or are suspected of manipulation. Suspended users forfeit
                                    any pending prizes and may be permanently banned from the platform.
                                </p>
                            </section>

                            <section className="p-6 rounded-2xl bg-card border border-border/50">
                                <h2 className="text-xl font-semibold mb-4">7. Governing Law</h2>
                                <p className="text-muted-foreground">
                                    These terms shall be governed by and construed in accordance with the laws of India.
                                    Any disputes arising from these terms shall be subject to the exclusive jurisdiction
                                    of the courts in Mumbai, Maharashtra.
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
